import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { differenceInCalendarDays, format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Bed,
  CheckCircle2,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DateRangePicker } from "../components/DateRangePicker";
import { ErrorMessage } from "../components/ErrorMessage";
import { GuestCountInput } from "../components/GuestCountInput";
import { Layout } from "../components/Layout";
import { LoadingPage } from "../components/LoadingSpinner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useCheckAvailability } from "../hooks/useReservation";
import { useRooms } from "../hooks/useRooms";

function BookingSummary({
  nightlyRate,
  checkIn,
  checkOut,
  isAvailable,
  onReserve,
}: {
  nightlyRate: number;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  isAvailable: boolean | undefined;
  onReserve: () => void;
}) {
  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
  const total = nights * nightlyRate;
  const deposit = Math.round(total * 0.3);
  const hasValidDates = checkIn && checkOut && nights > 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated sticky top-24">
      <div className="flex items-baseline gap-1 mb-6">
        <span className="font-display text-3xl font-bold text-foreground">
          ${nightlyRate}
        </span>
        <span className="text-muted-foreground text-sm">/ night</span>
      </div>

      {hasValidDates ? (
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${nightlyRate} × {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span className="font-medium text-foreground">${total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Deposit (30%)</span>
            <span className="font-medium text-foreground">${deposit}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold font-display text-lg text-foreground">
              ${total}
            </span>
          </div>
          {isAvailable === false && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Not available for these dates
            </div>
          )}
          {isAvailable === true && (
            <div className="flex items-center gap-2 text-accent-foreground text-sm bg-accent/20 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-secondary" />
              Available for your dates
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">
          Select check-in and check-out dates to see pricing.
        </p>
      )}

      <Button
        className="w-full py-6 text-base font-display font-semibold"
        disabled={!hasValidDates || isAvailable === false}
        onClick={onReserve}
        data-ocid="reserve-now-btn"
      >
        Reserve Now
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-3">
        Only the deposit is charged now. Balance due at check-in.
      </p>
    </div>
  );
}

export function RoomDetailPage() {
  const { roomId } = useParams({ from: "/rooms/$roomId" });
  const search = useSearch({ from: "/rooms/$roomId" }) as Record<
    string,
    string
  >;

  const [checkIn, setCheckIn] = useState<Date | undefined>(
    search.checkIn ? new Date(search.checkIn) : undefined,
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    search.checkOut ? new Date(search.checkOut) : undefined,
  );
  const [guests, setGuests] = useState(
    search.guests ? Number(search.guests) : 2,
  );

  const navigate = useNavigate();
  const { data: rooms, isLoading, error } = useRooms();
  const room = rooms?.find((r) => String(r.id) === roomId);

  const { data: isAvailable } = useCheckAvailability(
    room ? Number(room.id) : undefined,
    checkIn,
    checkOut,
  );

  if (isLoading) return <LoadingPage />;
  if (error)
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage
            title="Couldn't load room"
            message="We had trouble fetching room details."
            onRetry={() => navigate({ to: "/" })}
          />
        </div>
      </Layout>
    );
  if (!room)
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <ErrorMessage
            title="Room not found"
            message="This room doesn't exist or is no longer available."
          />
        </div>
      </Layout>
    );

  const nightlyRate = Number(room.nightlyRate);
  const capacity = Number(room.capacity);
  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
  const total = nights * nightlyRate;
  const deposit = Math.round(total * 0.3);

  const handleReserve = () => {
    if (!checkIn || !checkOut) return;
    navigate({
      to: "/book/$roomId",
      params: { roomId: String(room.id) },
      search: {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: String(guests),
        total: String(total),
        deposit: String(deposit),
      },
    });
  };

  const heroImage =
    room.imageUrls?.[0] ?? "/assets/generated/room-placeholder.jpg";
  const galleryImages = room.imageUrls?.slice(1, 4) ?? [];

  return (
    <Layout>
      <div className="bg-background" data-ocid="room-detail-page">
        {/* Back nav */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Rooms
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge variant="secondary" className="text-sm">
                {room.bedType}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-primary text-primary" />
                4.8 (120 reviews)
              </div>
              {!room.isAvailable && (
                <Badge variant="destructive">Currently Unavailable</Badge>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {room.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Up to {capacity} guests
              </span>
              <span className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" /> {room.bedType}
              </span>
            </div>
          </motion.div>

          {/* Image Gallery */}
          <div className="grid grid-cols-4 gap-3 mb-10 rounded-2xl overflow-hidden">
            <div className="col-span-4 md:col-span-2 aspect-[4/3]">
              <img
                src={heroImage}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            {galleryImages.length > 0 ? (
              galleryImages.map((url, i) => (
                <div key={url} className="hidden md:block aspect-[4/3]">
                  <img
                    src={url}
                    alt={`${room.name} view ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <>
                <div className="hidden md:block aspect-[4/3] bg-muted" />
                <div className="hidden md:block aspect-[4/3] bg-muted/70" />
              </>
            )}
          </div>

          {/* Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  About this room
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {room.description}
                </p>
              </section>

              {/* Amenities */}
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2.5 p-3 bg-muted/40 rounded-xl text-sm text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>

              {/* Date Picker Section (mobile) */}
              <section className="lg:hidden bg-card border border-border rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Select Your Stay
                </h2>
                <div className="space-y-4">
                  <DateRangePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onCheckInChange={setCheckIn}
                    onCheckOutChange={setCheckOut}
                  />
                  <div className="border border-border rounded-lg px-4 py-3">
                    <GuestCountInput
                      value={guests}
                      onChange={setGuests}
                      min={1}
                      max={capacity}
                    />
                  </div>
                  <BookingSummary
                    nightlyRate={nightlyRate}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    isAvailable={isAvailable}
                    onReserve={handleReserve}
                  />
                </div>
              </section>

              {/* Policies */}
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  House Policies
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    Check-in from 3:00 PM, check-out by 11:00 AM
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    30% deposit required to confirm your reservation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    Balance due at check-in
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    No smoking on premises
                  </li>
                </ul>
              </section>
            </div>

            {/* Right: Booking sidebar (desktop) */}
            <div className="hidden lg:block">
              <div className="space-y-4">
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                />
                <div className="border border-border rounded-lg px-4 py-3 bg-card">
                  <GuestCountInput
                    value={guests}
                    onChange={setGuests}
                    min={1}
                    max={capacity}
                  />
                </div>
                <BookingSummary
                  nightlyRate={nightlyRate}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  isAvailable={isAvailable}
                  onReserve={handleReserve}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
