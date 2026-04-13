import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { differenceInCalendarDays, format } from "date-fns";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createActor } from "../backend";
import { ErrorMessage } from "../components/ErrorMessage";
import { Layout } from "../components/Layout";
import { LoadingPage } from "../components/LoadingSpinner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useCreateReservation } from "../hooks/useReservation";
import { useRooms } from "../hooks/useRooms";

type BackendActorExt = {
  createDepositPaymentIntent: (
    reservationId: bigint,
  ) => Promise<
    { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
  >;
  recordDepositPaid: (
    reservationId: bigint,
    stripePaymentIntentId: string,
  ) => Promise<void>;
};

interface GuestFormValues {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numGuests: string;
}

type Step = "guest-info" | "payment" | "processing";

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step | "done"; label: string }[] = [
    { id: "guest-info", label: "Guest Info" },
    { id: "payment", label: "Deposit" },
    { id: "done", label: "Confirmed" },
  ];
  const current =
    step === "guest-info"
      ? 0
      : step === "payment" || step === "processing"
        ? 1
        : 2;

  return (
    <div className="flex items-center gap-0 mb-8" data-ocid="step-indicator">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-smooth ${
                i < current
                  ? "bg-secondary text-secondary-foreground"
                  : i === current
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < current ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium ${i === current ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-smooth ${i < current ? "bg-secondary" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function BookingSidePanel({
  roomName,
  checkIn,
  checkOut,
  guests,
  total,
  deposit,
}: {
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  total: number;
  deposit: number;
}) {
  const nights = differenceInCalendarDays(checkOut, checkIn);
  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 shadow-subtle sticky top-24"
      data-ocid="booking-summary"
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        Booking Summary
      </h3>
      <p className="text-sm text-muted-foreground mb-5">{roomName}</p>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Check-in</span>
          <span className="font-medium text-foreground">
            {format(checkIn, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Check-out</span>
          <span className="font-medium text-foreground">
            {format(checkOut, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium text-foreground">
            {nights} night{nights !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Guests</span>
          <span className="font-medium text-foreground">
            {guests} guest{guests !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold font-display text-foreground">
            ${total}
          </span>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-primary">
                Deposit due now
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                30% to confirm reservation
              </p>
            </div>
            <span className="font-display font-bold text-xl text-primary">
              ${deposit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingPage() {
  const { roomId } = useParams({ from: "/book/$roomId" });
  const search = useSearch({ from: "/book/$roomId" }) as Record<string, string>;
  const navigate = useNavigate();

  const checkIn = search.checkIn ? new Date(search.checkIn) : undefined;
  const checkOut = search.checkOut ? new Date(search.checkOut) : undefined;
  const guests = search.guests ? Number(search.guests) : 2;
  const total = search.total ? Number(search.total) : 0;
  const deposit = search.deposit ? Number(search.deposit) : 0;

  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const room = rooms?.find((r) => String(r.id) === roomId);
  const { actor } = useActor(createActor);

  const createReservation = useCreateReservation();

  const [step, setStep] = useState<Step>("guest-info");
  const [_reservationId, setReservationId] = useState<bigint | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardLast4, setCardLast4] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formValues, setFormValues] = useState<GuestFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormValues>({
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      numGuests: String(guests),
    },
  });

  if (roomsLoading) return <LoadingPage />;
  if (!checkIn || !checkOut) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage
            title="Missing dates"
            message="Please go back and select your check-in and check-out dates."
          />
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const roomName = room?.name ?? `Room ${roomId}`;

  const onGuestInfoSubmit = async (data: GuestFormValues) => {
    setFormValues(data);
    setStep("payment");
  };

  const onPaymentSubmit = async () => {
    if (!formValues || !checkIn || !checkOut) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const result = await createReservation.mutateAsync({
        guestName: formValues.guestName,
        guestEmail: formValues.guestEmail,
        guestPhone: formValues.guestPhone,
        roomId: Number(roomId),
        checkIn: BigInt(checkIn.getTime()),
        checkOut: BigInt(checkOut.getTime()),
        numGuests: Number(formValues.numGuests),
      });

      if ("err" in result) {
        setPaymentError(result.err);
        setIsProcessingPayment(false);
        return;
      }

      const resId = BigInt(result.ok);
      setReservationId(resId);

      // Create payment intent
      const intentResult = await (
        actor as unknown as BackendActorExt
      ).createDepositPaymentIntent(resId);

      if (intentResult.__kind__ === "err") {
        setPaymentError(intentResult.err);
        setIsProcessingPayment(false);
        return;
      }

      const paymentIntentId = intentResult.ok;

      // Record deposit paid
      await (actor as unknown as BackendActorExt).recordDepositPaid(
        resId,
        paymentIntentId,
      );

      navigate({
        to: "/confirmation/$reservationId",
        params: { reservationId: String(resId) },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      setPaymentError(msg);
      setIsProcessingPayment(false);
    }
  };

  return (
    <Layout>
      <div className="bg-background" data-ocid="booking-page">
        {/* Back nav */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <button
              type="button"
              onClick={() =>
                step === "guest-info"
                  ? navigate({
                      to: "/rooms/$roomId",
                      params: { roomId },
                    })
                  : setStep("guest-info")
              }
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === "guest-info" ? "Back to Room" : "Back to Guest Info"}
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form Area */}
            <div className="lg:col-span-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Complete Your Reservation
              </h1>

              <StepIndicator step={step} />

              <AnimatePresence mode="wait">
                {step === "guest-info" && (
                  <motion.div
                    key="guest-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <form
                      onSubmit={handleSubmit(onGuestInfoSubmit)}
                      className="space-y-6"
                      data-ocid="guest-info-form"
                    >
                      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                        <h2 className="font-display font-semibold text-lg text-foreground">
                          Guest Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="guestName">Full Name</Label>
                            <Input
                              id="guestName"
                              placeholder="Jane Doe"
                              data-ocid="guest-name-input"
                              {...register("guestName", {
                                required: "Full name is required",
                                minLength: {
                                  value: 2,
                                  message: "Name must be at least 2 characters",
                                },
                              })}
                            />
                            {errors.guestName && (
                              <p className="text-xs text-destructive">
                                {errors.guestName.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="guestEmail">Email Address</Label>
                            <Input
                              id="guestEmail"
                              type="email"
                              placeholder="jane@example.com"
                              data-ocid="guest-email-input"
                              {...register("guestEmail", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Invalid email address",
                                },
                              })}
                            />
                            {errors.guestEmail && (
                              <p className="text-xs text-destructive">
                                {errors.guestEmail.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="guestPhone">Phone Number</Label>
                            <Input
                              id="guestPhone"
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              data-ocid="guest-phone-input"
                              {...register("guestPhone", {
                                required: "Phone number is required",
                                minLength: {
                                  value: 7,
                                  message: "Enter a valid phone number",
                                },
                              })}
                            />
                            {errors.guestPhone && (
                              <p className="text-xs text-destructive">
                                {errors.guestPhone.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="numGuests">Number of Guests</Label>
                            <Input
                              id="numGuests"
                              type="number"
                              min={1}
                              max={Number(room?.capacity ?? 10)}
                              data-ocid="num-guests-input"
                              {...register("numGuests", {
                                required: "Guest count is required",
                                min: { value: 1, message: "Minimum 1 guest" },
                                max: {
                                  value: Number(room?.capacity ?? 10),
                                  message: `Maximum ${Number(room?.capacity ?? 10)} guests`,
                                },
                              })}
                            />
                            {errors.numGuests && (
                              <p className="text-xs text-destructive">
                                {errors.numGuests.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Your information is secure and will only be used for
                          this reservation.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 text-base font-display font-semibold"
                        data-ocid="continue-to-payment-btn"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving…
                          </>
                        ) : (
                          "Continue to Payment"
                        )}
                      </Button>
                    </form>
                  </motion.div>
                )}

                {(step === "payment" || step === "processing") && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                    data-ocid="payment-form"
                  >
                    {/* Guest Summary */}
                    {formValues && (
                      <div className="bg-muted/30 border border-border rounded-xl p-4 text-sm">
                        <p className="font-medium text-foreground">
                          {formValues.guestName}
                        </p>
                        <p className="text-muted-foreground">
                          {formValues.guestEmail}
                        </p>
                        <p className="text-muted-foreground">
                          {formValues.guestPhone}
                        </p>
                      </div>
                    )}

                    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Deposit Payment
                      </h2>

                      <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 text-sm flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            Amount due today
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            30% deposit to secure your stay
                          </p>
                        </div>
                        <span className="font-display font-bold text-2xl text-primary">
                          ${deposit}
                        </span>
                      </div>

                      {/* Simulated Stripe card input */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Card Number</Label>
                          <div className="relative">
                            <Input
                              placeholder="4242 4242 4242 4242"
                              maxLength={19}
                              value={cardLast4}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                const formatted = raw
                                  .slice(0, 16)
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim();
                                setCardLast4(formatted);
                              }}
                              className="pr-12"
                              data-ocid="card-number-input"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                              💳
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Expiry</Label>
                            <Input
                              placeholder="MM / YY"
                              maxLength={7}
                              data-ocid="card-expiry-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CVC</Label>
                            <Input
                              placeholder="123"
                              maxLength={4}
                              type="password"
                              data-ocid="card-cvc-input"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Name on Card</Label>
                          <Input
                            placeholder={formValues?.guestName ?? "Jane Doe"}
                            data-ocid="card-name-input"
                          />
                        </div>
                      </div>

                      {paymentError && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3">
                          <span>{paymentError}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>🔒</span>
                        <span>
                          Your payment is encrypted and secured via Stripe.
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={onPaymentSubmit}
                      disabled={isProcessingPayment}
                      className="w-full py-6 text-base font-display font-semibold"
                      data-ocid="pay-deposit-btn"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing…
                        </>
                      ) : (
                        `Pay $${deposit} Deposit`
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By paying you agree to our cancellation and refund policy.
                      Balance of ${total - deposit} is due at check-in.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="order-first lg:order-last">
              <BookingSidePanel
                roomName={roomName}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                total={total}
                deposit={deposit}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
