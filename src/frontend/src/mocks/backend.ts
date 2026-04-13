import type { backendInterface } from "../backend";
import { ReservationStatus, UserRole } from "../backend";

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,

  assignCallerUserRole: async (_user, _role) => undefined,

  checkAvailability: async (_roomId, _checkIn, _checkOut) => true,

  confirmReservation: async (_reservationId) => undefined,

  createCheckoutSession: async (_items, _successUrl, _cancelUrl) =>
    "https://checkout.stripe.com/pay/cs_test_mock",

  createDepositPaymentIntent: async (_reservationId) => ({
    __kind__: "ok",
    ok: "pi_mock_secret_abc123",
  }),

  createReservation: async (
    _guestName,
    _guestEmail,
    _guestPhone,
    _roomId,
    _checkIn,
    _checkOut,
    _numGuests
  ) => ({ __kind__: "ok", ok: BigInt(1) }),

  getCallerUserRole: async () => UserRole.user,

  getReservation: async (_reservationId) => ({
    id: BigInt(1),
    status: ReservationStatus.Pending,
    depositAmount: BigInt(5000),
    checkIn: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: BigInt(Date.now()),
    guestName: "Sarah Mitchell",
    guestEmail: "sarah.mitchell@example.com",
    numGuests: BigInt(2),
    totalAmount: BigInt(45000),
    checkOut: BigInt(Date.now() + 10 * 24 * 60 * 60 * 1000),
    guestPhone: "+1 555-0182",
    roomId: BigInt(1),
    depositPaid: false,
  }),

  getStripeSessionStatus: async (_sessionId) => ({
    __kind__: "completed",
    completed: { response: "paid" },
  }),

  isCallerAdmin: async () => false,

  isStripeConfigured: async () => true,

  listReservations: async () => [
    {
      id: BigInt(1),
      status: ReservationStatus.Pending,
      depositAmount: BigInt(5000),
      checkIn: BigInt(new Date("2026-05-10").getTime()),
      createdAt: BigInt(Date.now()),
      guestName: "Sarah Mitchell",
      guestEmail: "sarah.mitchell@example.com",
      numGuests: BigInt(2),
      totalAmount: BigInt(45000),
      checkOut: BigInt(new Date("2026-05-13").getTime()),
      guestPhone: "+1 555-0182",
      roomId: BigInt(1),
      depositPaid: false,
    },
    {
      id: BigInt(2),
      status: ReservationStatus.Confirmed,
      depositAmount: BigInt(7500),
      checkIn: BigInt(new Date("2026-05-15").getTime()),
      createdAt: BigInt(Date.now()),
      guestName: "James Okafor",
      guestEmail: "j.okafor@example.com",
      numGuests: BigInt(3),
      totalAmount: BigInt(62000),
      checkOut: BigInt(new Date("2026-05-19").getTime()),
      guestPhone: "+1 555-0247",
      roomId: BigInt(2),
      depositPaid: true,
    },
    {
      id: BigInt(3),
      status: ReservationStatus.Rejected,
      depositAmount: BigInt(4000),
      checkIn: BigInt(new Date("2026-05-20").getTime()),
      createdAt: BigInt(Date.now()),
      guestName: "Priya Nair",
      guestEmail: "priya.nair@example.com",
      numGuests: BigInt(1),
      totalAmount: BigInt(28000),
      checkOut: BigInt(new Date("2026-05-22").getTime()),
      guestPhone: "+1 555-0394",
      roomId: BigInt(3),
      depositPaid: false,
      rejectionReason: "Requested dates are unavailable",
    },
  ],

  listRooms: async () => [
    {
      id: BigInt(1),
      name: "Terrace Suite",
      bedType: "King",
      nightlyRate: BigInt(15000),
      capacity: BigInt(2),
      isAvailable: true,
      description:
        "Spacious suite with a private terrace overlooking the garden courtyard. Features warm terracotta tones and handcrafted furnishings.",
      amenities: ["Private Terrace", "King Bed", "Soaking Tub", "WiFi", "Air Conditioning"],
      imageUrls: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      ],
    },
    {
      id: BigInt(2),
      name: "Garden Deluxe",
      bedType: "Queen",
      nightlyRate: BigInt(12000),
      capacity: BigInt(3),
      isAvailable: true,
      description:
        "Elegant room with garden views and earthy sage green accents. Perfect for families or small groups seeking comfort.",
      amenities: ["Garden View", "Queen Bed", "Mini Bar", "WiFi", "Rainfall Shower"],
      imageUrls: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      ],
    },
    {
      id: BigInt(3),
      name: "Classic Room",
      bedType: "Double",
      nightlyRate: BigInt(9000),
      capacity: BigInt(2),
      isAvailable: true,
      description:
        "Cozy and well-appointed room with classic hospitality touches. Warm cream walls and natural wood accents throughout.",
      amenities: ["City View", "Double Bed", "WiFi", "Air Conditioning", "Work Desk"],
      imageUrls: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      ],
    },
    {
      id: BigInt(4),
      name: "Penthouse Suite",
      bedType: "King",
      nightlyRate: BigInt(28000),
      capacity: BigInt(4),
      isAvailable: false,
      description:
        "The pinnacle of luxury at HoReCarLux. Floor-to-ceiling windows, a wraparound balcony, and bespoke decor.",
      amenities: [
        "Wraparound Balcony",
        "King Bed",
        "Butler Service",
        "Jacuzzi",
        "Premium WiFi",
      ],
      imageUrls: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      ],
    },
  ],

  recordDepositPaid: async (_reservationId, _stripePaymentIntentId) => undefined,

  rejectReservation: async (_reservationId, _reason) => undefined,

  setStripeConfiguration: async (_config) => undefined,

  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: [],
  }),
};
