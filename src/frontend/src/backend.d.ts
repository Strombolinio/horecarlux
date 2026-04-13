import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Reservation {
    id: ReservationId;
    status: ReservationStatus;
    depositAmount: bigint;
    checkIn: bigint;
    createdAt: bigint;
    rejectionReason?: string;
    guestName: string;
    guestEmail: string;
    numGuests: bigint;
    totalAmount: bigint;
    checkOut: bigint;
    stripePaymentIntentId?: string;
    guestPhone: string;
    roomId: RoomId;
    depositPaid: boolean;
}
export type RoomId = bigint;
export interface Room {
    id: RoomId;
    bedType: string;
    imageUrls: Array<string>;
    nightlyRate: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    amenities: Array<string>;
    capacity: bigint;
}
export type ReservationId = bigint;
export type CreateReservationResult = {
    __kind__: "ok";
    ok: ReservationId;
} | {
    __kind__: "err";
    err: string;
};
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export enum ReservationStatus {
    Confirmed = "Confirmed",
    Rejected = "Rejected",
    Pending = "Pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkAvailability(roomId: RoomId, checkIn: bigint, checkOut: bigint): Promise<boolean>;
    confirmReservation(reservationId: ReservationId): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createDepositPaymentIntent(reservationId: ReservationId): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createReservation(guestName: string, guestEmail: string, guestPhone: string, roomId: RoomId, checkIn: bigint, checkOut: bigint, numGuests: bigint): Promise<CreateReservationResult>;
    getCallerUserRole(): Promise<UserRole>;
    getReservation(reservationId: ReservationId): Promise<Reservation | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listReservations(): Promise<Array<Reservation>>;
    listRooms(): Promise<Array<Room>>;
    recordDepositPaid(reservationId: ReservationId, stripePaymentIntentId: string): Promise<void>;
    rejectReservation(reservationId: ReservationId, reason: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
