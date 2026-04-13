import { format } from "date-fns";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  LogIn,
  LogOut,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ReservationStatus } from "../backend";
import { StatusBadge } from "../components/Badge";
import { ErrorMessage } from "../components/ErrorMessage";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../hooks/useAuth";
import { useListReservations } from "../hooks/useReservation";
import {
  useConfirmReservation,
  useRejectReservation,
} from "../hooks/useReservation";
import { useRooms } from "../hooks/useRooms";
import type { Reservation } from "../types";
import { getStatusLabel, getStatusVariant } from "../types";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(ns: bigint): string {
  return format(new Date(Number(ns)), "MMM d, yyyy");
}

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}

// ── sub-components ────────────────────────────────────────────────────────────

interface RejectDialogProps {
  open: boolean;
  reservationId: number;
  guestName: string;
  onClose: () => void;
}

function RejectDialog({
  open,
  reservationId,
  guestName,
  onClose,
}: RejectDialogProps) {
  const [reason, setReason] = useState("");
  const rejectMutation = useRejectReservation();

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({ reservationId, reason });
      toast.success(`Reservation for ${guestName} has been rejected.`);
      setReason("");
      onClose();
    } catch {
      toast.error("Failed to reject reservation. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="reject-dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Reject Reservation</DialogTitle>
          <DialogDescription>
            Reject the reservation for <strong>{guestName}</strong>. You may
            optionally provide a reason.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Textarea
            placeholder="Optional: reason for rejection…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="resize-none"
            data-ocid="reject-reason-input"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={rejectMutation.isPending}
            data-ocid="reject-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={rejectMutation.isPending}
            className="gap-2"
            data-ocid="reject-confirm-btn"
          >
            {rejectMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Reject Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── reservation row ───────────────────────────────────────────────────────────

interface ReservationRowProps {
  reservation: Reservation;
  roomName: string;
  onRejectOpen: (id: number, guestName: string) => void;
}

function ReservationRow({
  reservation,
  roomName,
  onRejectOpen,
}: ReservationRowProps) {
  const confirmMutation = useConfirmReservation();
  const isPending = reservation.status === ReservationStatus.Pending;
  const statusLabel = getStatusLabel(reservation.status);
  const statusVariant = getStatusVariant(reservation.status);

  const handleConfirm = async () => {
    try {
      await confirmMutation.mutateAsync(Number(reservation.id));
      toast.success(`Reservation for ${reservation.guestName} confirmed!`);
    } catch {
      toast.error("Failed to confirm reservation. Please try again.");
    }
  };

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-subtle transition-smooth"
      data-ocid={`reservation-row-${reservation.id}`}
    >
      {/* Guest info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-primary text-sm">
              {reservation.guestName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-foreground truncate text-sm sm:text-base">
              {reservation.guestName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {reservation.guestEmail}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground ml-12">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="truncate max-w-[140px]">{roomName}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {formatDate(reservation.checkIn)} –{" "}
            {formatDate(reservation.checkOut)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            {reservation.numGuests} guest
            {Number(reservation.numGuests) !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Status badges + actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
        {/* Deposit badge */}
        {reservation.depositPaid ? (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/15 text-secondary-foreground border border-secondary/30"
            data-ocid="deposit-paid-badge"
          >
            <CreditCard className="w-3 h-3" />
            Deposit Paid
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
            data-ocid="deposit-pending-badge"
          >
            <Clock className="w-3 h-3" />
            Awaiting Deposit
          </span>
        )}

        {/* Reservation status badge */}
        <StatusBadge
          variant={statusVariant}
          data-ocid={`status-badge-${reservation.id}`}
        >
          {statusLabel}
        </StatusBadge>

        {/* Action buttons — only for pending + deposit paid */}
        {isPending && reservation.depositPaid && (
          <div
            className="flex items-center gap-2"
            data-ocid="reservation-actions"
          >
            <Button
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              onClick={handleConfirm}
              disabled={confirmMutation.isPending}
              data-ocid={`confirm-btn-${reservation.id}`}
            >
              {confirmMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Confirm
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                onRejectOpen(Number(reservation.id), reservation.guestName)
              }
              disabled={confirmMutation.isPending}
              data-ocid={`reject-btn-${reservation.id}`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── empty state ───────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-3"
      data-ocid="empty-state"
    >
      <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
        <Calendar
          className="w-7 h-7 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

// ── login gate ────────────────────────────────────────────────────────────────

function LoginGate({
  login,
  isLoading,
}: { login: () => void; isLoading: boolean }) {
  return (
    <Layout>
      <div
        className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4"
        data-ocid="staff-login-gate"
      >
        {/* Icon block */}
        <div className="relative">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shadow-subtle">
            <Building2 className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary/20 border-2 border-background rounded-full flex items-center justify-center">
            <LogIn className="w-3.5 h-3.5 text-secondary-foreground" />
          </div>
        </div>

        {/* Copy */}
        <div className="text-center max-w-sm">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
            Staff Portal
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sign in with Internet Identity to manage reservations, confirm
            bookings, and view payment status.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={login}
          disabled={isLoading}
          size="lg"
          className="gap-2 px-8 font-semibold"
          data-ocid="staff-login-btn"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {isLoading ? "Signing in…" : "Sign In with Internet Identity"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Staff access only — guests don't need an account.
        </p>
      </div>
    </Layout>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export function StaffDashboardPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
    principalId,
  } = useAuth();
  const {
    data: reservations = [],
    isLoading,
    error,
    refetch,
  } = useListReservations();
  const { data: rooms = [] } = useRooms();

  const [rejectTarget, setRejectTarget] = useState<{
    id: number;
    guestName: string;
  } | null>(null);

  // Room name lookup map
  const roomMap = new Map(rooms.map((r) => [r.id, r.name]));

  if (!isAuthenticated) {
    return <LoginGate login={login} isLoading={authLoading} />;
  }

  // Compute tab data
  const pendingWithDeposit = reservations.filter(
    (r) => r.status === ReservationStatus.Pending && r.depositPaid,
  );
  const pendingAwaitingDeposit = reservations.filter(
    (r) => r.status === ReservationStatus.Pending && !r.depositPaid,
  );
  const allPending = [...pendingWithDeposit, ...pendingAwaitingDeposit];

  const allSorted = [...reservations].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <Layout>
      <div
        className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl"
        data-ocid="staff-dashboard"
      >
        {/* Dashboard header */}
        <div className="bg-card border border-border rounded-2xl px-6 py-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Staff Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage reservations and confirm bookings
            </p>
          </div>

          {/* Principal + logout */}
          <div
            className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-2.5 border border-border"
            data-ocid="staff-identity"
          >
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-primary font-display font-bold text-sm">
                S
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">Staff</p>
              {principalId && (
                <p
                  className="text-xs text-muted-foreground font-mono truncate max-w-[140px]"
                  title={principalId}
                >
                  {truncatePrincipal(principalId)}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-1.5 text-muted-foreground hover:text-foreground ml-1"
              data-ocid="staff-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only">Logout</span>
            </Button>
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <StatPill
            label="Pending Approval"
            value={allPending.length}
            highlight={allPending.length > 0}
          />
          <StatPill
            label="Ready to Confirm"
            value={pendingWithDeposit.length}
            highlight={pendingWithDeposit.length > 0}
          />
          <StatPill
            label="Total Reservations"
            value={reservations.length}
            highlight={false}
          />
        </div>

        {/* Content area */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Loading reservations…" />
          </div>
        ) : error ? (
          <ErrorMessage
            message="Could not load reservations. Please try again."
            onRetry={() => refetch()}
          />
        ) : (
          <Tabs defaultValue="pending" data-ocid="dashboard-tabs">
            <TabsList className="mb-6 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
              <TabsTrigger
                value="pending"
                className="flex-1 sm:flex-none gap-2 data-[state=active]:bg-card data-[state=active]:shadow-subtle rounded-lg"
                data-ocid="tab-pending"
              >
                <Clock className="w-4 h-4" aria-hidden="true" />
                Pending
                {allPending.length > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {allPending.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="flex-1 sm:flex-none gap-2 data-[state=active]:bg-card data-[state=active]:shadow-subtle rounded-lg"
                data-ocid="tab-all"
              >
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                All Reservations
                <span className="ml-1 text-muted-foreground text-xs">
                  ({reservations.length})
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Pending tab */}
            <TabsContent value="pending" data-ocid="tab-content-pending">
              {allPending.length === 0 ? (
                <EmptyState message="No pending reservations — all caught up!" />
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Ready to confirm */}
                  {pendingWithDeposit.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Ready to Confirm — deposit received
                        </h2>
                      </div>
                      <div className="flex flex-col gap-3">
                        {pendingWithDeposit.map((r) => (
                          <ReservationRow
                            key={r.id}
                            reservation={r}
                            roomName={
                              roomMap.get(r.roomId) ?? `Room ${r.roomId}`
                            }
                            onRejectOpen={(id, name) =>
                              setRejectTarget({ id, guestName: name })
                            }
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Awaiting deposit */}
                  {pendingAwaitingDeposit.length > 0 && (
                    <section className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Awaiting Deposit
                        </h2>
                      </div>
                      <div className="flex flex-col gap-3">
                        {pendingAwaitingDeposit.map((r) => (
                          <ReservationRow
                            key={r.id}
                            reservation={r}
                            roomName={
                              roomMap.get(r.roomId) ?? `Room ${r.roomId}`
                            }
                            onRejectOpen={(id, name) =>
                              setRejectTarget({ id, guestName: name })
                            }
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </TabsContent>

            {/* All tab */}
            <TabsContent value="all" data-ocid="tab-content-all">
              {allSorted.length === 0 ? (
                <EmptyState message="No reservations yet." />
              ) : (
                <div className="flex flex-col gap-3">
                  {allSorted.map((r) => (
                    <ReservationRow
                      key={r.id}
                      reservation={r}
                      roomName={roomMap.get(r.roomId) ?? `Room ${r.roomId}`}
                      onRejectOpen={(id, name) =>
                        setRejectTarget({ id, guestName: name })
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Reject dialog */}
      {rejectTarget && (
        <RejectDialog
          open={!!rejectTarget}
          reservationId={rejectTarget.id}
          guestName={rejectTarget.guestName}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </Layout>
  );
}

// ── stat pill ─────────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 flex flex-col gap-0.5 ${
        highlight ? "bg-primary/5 border-primary/20" : "bg-card border-border"
      }`}
    >
      <span className="text-xl font-display font-bold text-foreground">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
