import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Printer,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "../components/Badge";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/ui/button";
import { useReservation } from "../hooks/useReservation";
import { useRooms } from "../hooks/useRooms";
import { getStatusLabel, getStatusVariant } from "../types";

function formatDate(ts: bigint): string {
  const date = new Date(Number(ts));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(ts: bigint): string {
  const date = new Date(Number(ts));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calcNights(checkIn: bigint, checkOut: bigint): number {
  const ms = Number(checkOut) - Number(checkIn);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatCurrency(amount: number | bigint): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-primary">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <div className="text-foreground font-medium">{value}</div>
      </div>
    </div>
  );
}

export function ConfirmationPage() {
  const { reservationId } = useParams({ from: "/confirmation/$reservationId" });
  const resId = Number.parseInt(reservationId, 10);

  const {
    data: reservation,
    isLoading: resLoading,
    error: resError,
  } = useReservation(Number.isNaN(resId) ? undefined : resId);

  const { data: rooms = [], isLoading: roomsLoading } = useRooms();

  const isLoading = resLoading || roomsLoading;

  const room = reservation
    ? rooms.find((r) => Number(r.id) === Number(reservation.roomId))
    : undefined;

  if (isLoading) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center min-h-[60vh]"
          data-ocid="confirmation-loading"
        >
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (resError || !reservation) {
    return (
      <Layout>
        <div
          className="container mx-auto px-4 sm:px-6 py-16 text-center"
          data-ocid="confirmation-error"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Reservation Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find this reservation. Please check your confirmation
            link or contact us.
          </p>
          <Button asChild variant="default">
            <Link to="/">Browse Rooms</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const nights = calcNights(reservation.checkIn, reservation.checkOut);

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[80vh]" data-ocid="confirmation-page">
        {/* Hero banner */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center max-w-xl mx-auto"
            >
              {/* Terracotta success icon */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
                  <CheckCircle2
                    className="w-10 h-10 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <span className="text-primary-foreground text-xs font-bold">
                    ✓
                  </span>
                </motion.div>
              </div>

              <StatusBadge
                variant={getStatusVariant(reservation.status)}
                className="mb-3 px-4 py-1.5 text-sm"
              >
                {getStatusLabel(reservation.status)}
              </StatusBadge>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
                Booking Confirmed
              </h1>
              <p className="text-muted-foreground text-base">
                Awaiting staff approval — you'll receive updates via email once
                your reservation is reviewed.
              </p>

              <div className="mt-4 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Confirmation #
                </span>
                <span
                  className="font-display font-bold text-primary text-lg"
                  data-ocid="confirmation-number"
                >
                  {String(reservation.id).padStart(5, "0")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Booking details card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden"
              data-ocid="confirmation-details-card"
            >
              <div className="px-6 pt-6 pb-2 border-b border-border">
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Reservation Details
                </h2>
              </div>
              <div className="px-6">
                <DetailRow
                  icon={<Users className="w-4 h-4" />}
                  label="Guest Name"
                  value={reservation.guestName}
                />
                {room && (
                  <DetailRow
                    icon={<BedDouble className="w-4 h-4" />}
                    label="Room"
                    value={room.name}
                  />
                )}
                <DetailRow
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Check-in"
                  value={formatDate(reservation.checkIn)}
                />
                <DetailRow
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Check-out"
                  value={
                    <span>
                      {formatDate(reservation.checkOut)}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        ({nights} night{nights !== 1 ? "s" : ""})
                      </span>
                    </span>
                  }
                />
                <DetailRow
                  icon={<Users className="w-4 h-4" />}
                  label="Guests"
                  value={`${reservation.numGuests} guest${Number(reservation.numGuests) !== 1 ? "s" : ""}`}
                />
              </div>
            </motion.div>

            {/* Payment summary card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="bg-card rounded-2xl border border-border shadow-subtle overflow-hidden"
              data-ocid="confirmation-payment-card"
            >
              <div className="px-6 pt-6 pb-2 border-b border-border">
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Payment Summary
                </h2>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {room?.name ?? "Room"} × {nights} night
                    {nights !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(reservation.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CreditCard className="w-3.5 h-3.5" />
                    Deposit paid
                  </span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(reservation.depositAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-dashed border-border pt-3">
                  <span className="font-medium text-foreground">
                    Balance due at check-in
                  </span>
                  <span className="font-bold text-foreground text-base">
                    {formatCurrency(
                      Number(reservation.totalAmount) -
                        Number(reservation.depositAmount),
                    )}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stay summary pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
              data-ocid="confirmation-dates-banner"
            >
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                  Check-in
                </p>
                <p className="font-display font-semibold text-foreground">
                  {formatShortDate(reservation.checkIn)}
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-center">
                <div className="w-24 h-px bg-border" />
                <span className="text-xs text-muted-foreground mt-1">
                  {nights}n
                </span>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                  Check-out
                </p>
                <p className="font-display font-semibold text-foreground">
                  {formatShortDate(reservation.checkOut)}
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Button
                variant="outline"
                className="gap-2 flex-1"
                onClick={() => window.print()}
                data-ocid="confirmation-print-btn"
              >
                <Printer className="w-4 h-4" />
                Print / Save as PDF
              </Button>
              <Button
                asChild
                variant="default"
                className="gap-2 flex-1"
                data-ocid="confirmation-browse-btn"
              >
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                  Browse More Rooms
                </Link>
              </Button>
            </motion.div>

            <p className="text-center text-xs text-muted-foreground pb-6">
              A copy of this confirmation has been noted. Bring this reference
              number{" "}
              <strong className="text-foreground">
                #{String(reservation.id).padStart(5, "0")}
              </strong>{" "}
              when you check in.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
