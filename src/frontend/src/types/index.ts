import { ReservationStatus } from "../backend";

export type { ReservationStatus };

export interface Room {
  id: bigint | number;
  name: string;
  description: string;
  nightlyRate: bigint | number;
  capacity: bigint | number;
  bedType: string;
  amenities: string[];
  imageUrls: string[];
  isAvailable: boolean;
}

export interface Reservation {
  id: bigint | number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: bigint | number;
  checkIn: bigint;
  checkOut: bigint;
  numGuests: bigint | number;
  totalAmount: bigint | number;
  depositAmount: bigint | number;
  depositPaid: boolean;
  stripePaymentIntentId: string | null | undefined;
  status: ReservationStatus;
  createdAt: bigint;
  rejectionReason: string | null | undefined;
}

export interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
}

export function getStatusLabel(status: ReservationStatus): string {
  if (status === ReservationStatus.Pending) return "Pending";
  if (status === ReservationStatus.Confirmed) return "Confirmed";
  if (status === ReservationStatus.Rejected) return "Rejected";
  return "Unknown";
}

export function getStatusVariant(
  status: ReservationStatus,
): "pending" | "confirmed" | "rejected" {
  if (status === ReservationStatus.Pending) return "pending";
  if (status === ReservationStatus.Confirmed) return "confirmed";
  return "rejected";
}
