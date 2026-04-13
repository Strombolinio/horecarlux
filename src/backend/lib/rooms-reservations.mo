import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Types "../types/rooms-reservations";

module {
  // ── Room queries ──────────────────────────────────────────────────────────

  public func listRooms(rooms : Map.Map<Types.RoomId, Types.Room>) : [Types.Room] {
    rooms.values().toArray();
  };

  public func checkAvailability(
    rooms : Map.Map<Types.RoomId, Types.Room>,
    reservations : Map.Map<Types.ReservationId, Types.Reservation>,
    roomId : Types.RoomId,
    checkIn : Int,
    checkOut : Int,
  ) : Bool {
    // Room must exist
    switch (rooms.get(roomId)) {
      case (null) { return false };
      case (?_) {};
    };
    // Check for any overlapping confirmed or pending reservation
    let hasConflict = reservations.values().any(func(r : Types.Reservation) : Bool {
      if (r.roomId != roomId) { return false };
      switch (r.status) {
        case (#Rejected) { return false };
        case (_) {};
      };
      // Overlap: existing check-in < requested check-out AND existing check-out > requested check-in
      r.checkIn < checkOut and r.checkOut > checkIn;
    });
    not hasConflict;
  };

  // ── Reservation mutations ─────────────────────────────────────────────────

  public func createReservation(
    rooms : Map.Map<Types.RoomId, Types.Room>,
    reservations : Map.Map<Types.ReservationId, Types.Reservation>,
    nextId : Nat,
    req : Types.CreateReservationRequest,
  ) : Types.CreateReservationResult {
    // Validate room exists
    let room = switch (rooms.get(req.roomId)) {
      case (null) { return #err("Room not found") };
      case (?r) { r };
    };
    // Validate dates
    if (req.checkIn >= req.checkOut) {
      return #err("Check-in must be before check-out");
    };
    // Check availability
    let available = checkAvailability(rooms, reservations, req.roomId, req.checkIn, req.checkOut);
    if (not available) {
      return #err("Room is not available for the requested dates");
    };
    // Calculate amounts: nights = (checkOut - checkIn) in nanoseconds / 86400 seconds * 1e9
    let nsPerDay : Int = 86_400_000_000_000;
    let nights : Nat = ((req.checkOut - req.checkIn) / nsPerDay).toNat();
    if (nights == 0) {
      return #err("Reservation must be at least one night");
    };
    let totalAmount : Nat = nights * room.nightlyRate;
    let depositAmount : Nat = totalAmount / 5; // 20%

    let reservation : Types.Reservation = {
      id = nextId;
      guestName = req.guestName;
      guestEmail = req.guestEmail;
      guestPhone = req.guestPhone;
      roomId = req.roomId;
      checkIn = req.checkIn;
      checkOut = req.checkOut;
      numGuests = req.numGuests;
      totalAmount;
      depositAmount;
      depositPaid = false;
      stripePaymentIntentId = null;
      status = #Pending;
      createdAt = Time.now();
      rejectionReason = null;
    };
    reservations.add(nextId, reservation);
    #ok(nextId);
  };

  public func recordDepositPaid(
    reservations : Map.Map<Types.ReservationId, Types.Reservation>,
    reservationId : Types.ReservationId,
    stripePaymentIntentId : Text,
  ) : () {
    let reservation = switch (reservations.get(reservationId)) {
      case (null) { Runtime.trap("Reservation not found") };
      case (?r) { r };
    };
    reservations.add(reservationId, { reservation with depositPaid = true; stripePaymentIntentId = ?stripePaymentIntentId });
  };

  public func confirmReservation(
    reservations : Map.Map<Types.ReservationId, Types.Reservation>,
    reservationId : Types.ReservationId,
  ) : () {
    let reservation = switch (reservations.get(reservationId)) {
      case (null) { Runtime.trap("Reservation not found") };
      case (?r) { r };
    };
    if (not reservation.depositPaid) {
      Runtime.trap("Cannot confirm reservation: deposit has not been paid");
    };
    reservations.add(reservationId, { reservation with status = #Confirmed });
  };

  public func rejectReservation(
    reservations : Map.Map<Types.ReservationId, Types.Reservation>,
    reservationId : Types.ReservationId,
    reason : Text,
  ) : () {
    let reservation = switch (reservations.get(reservationId)) {
      case (null) { Runtime.trap("Reservation not found") };
      case (?r) { r };
    };
    reservations.add(reservationId, { reservation with status = #Rejected; rejectionReason = ?reason });
  };

  // ── Reservation queries ───────────────────────────────────────────────────

  public func listReservations(
    reservations : Map.Map<Types.ReservationId, Types.Reservation>,
  ) : [Types.Reservation] {
    let all = reservations.values().toArray();
    // Sort by createdAt descending
    all.sort(func(a : Types.Reservation, b : Types.Reservation) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt);
    });
  };

  public func getReservation(
    reservations : Map.Map<Types.ReservationId, Types.Reservation>,
    reservationId : Types.ReservationId,
  ) : ?Types.Reservation {
    reservations.get(reservationId);
  };

  // ── Seed data helper ──────────────────────────────────────────────────────

  public func seedRooms(rooms : Map.Map<Types.RoomId, Types.Room>) : () {
    if (not rooms.isEmpty()) { return };

    let sampleRooms : [Types.Room] = [
      {
        id = 1;
        name = "Deluxe King Room";
        description = "Spacious king room with city views, plush bedding, and a marble bathroom with soaking tub.";
        nightlyRate = 28_900; // $289.00
        capacity = 2;
        bedType = "King";
        amenities = ["Free Wi-Fi", "City View", "Soaking Tub", "Mini Bar", "Smart TV", "Coffee Maker"];
        imageUrls = ["https://placehold.co/800x600/2d6a4f/ffffff?text=Deluxe+King+Room"];
        isAvailable = true;
      },
      {
        id = 2;
        name = "Superior Twin Room";
        description = "Comfortable twin room ideal for colleagues or friends, featuring two full beds and a modern ensuite.";
        nightlyRate = 19_900; // $199.00
        capacity = 2;
        bedType = "Twin";
        amenities = ["Free Wi-Fi", "Garden View", "Ensuite Bathroom", "Work Desk", "Smart TV"];
        imageUrls = ["https://placehold.co/800x600/1d3557/ffffff?text=Superior+Twin+Room"];
        isAvailable = true;
      },
      {
        id = 3;
        name = "Executive Suite";
        description = "Lavish suite with a separate living area, panoramic ocean views, and premium in-room amenities.";
        nightlyRate = 55_000; // $550.00
        capacity = 3;
        bedType = "King";
        amenities = ["Free Wi-Fi", "Ocean View", "Separate Living Area", "Jacuzzi", "Butler Service", "Complimentary Breakfast", "Mini Bar"];
        imageUrls = ["https://placehold.co/800x600/457b9d/ffffff?text=Executive+Suite"];
        isAvailable = true;
      },
      {
        id = 4;
        name = "Classic Double Room";
        description = "Cozy double room with warm decor, ideal for couples seeking a relaxing getaway on a budget.";
        nightlyRate = 14_900; // $149.00
        capacity = 2;
        bedType = "Double";
        amenities = ["Free Wi-Fi", "Courtyard View", "Private Bathroom", "Coffee Maker"];
        imageUrls = ["https://placehold.co/800x600/6d4c41/ffffff?text=Classic+Double+Room"];
        isAvailable = true;
      },
      {
        id = 5;
        name = "Family Suite";
        description = "Generous family suite with a king bed and two bunk beds, a kitchenette, and a kids' play corner.";
        nightlyRate = 38_500; // $385.00
        capacity = 5;
        bedType = "King + Bunk";
        amenities = ["Free Wi-Fi", "Pool View", "Kitchenette", "Kids' Play Corner", "Two Bathrooms", "Smart TV"];
        imageUrls = ["https://placehold.co/800x600/0077b6/ffffff?text=Family+Suite"];
        isAvailable = true;
      },
      {
        id = 6;
        name = "Penthouse Suite";
        description = "The pinnacle of luxury — a two-story penthouse with a private terrace, grand piano, and 360° skyline views.";
        nightlyRate = 120_000; // $1200.00
        capacity = 4;
        bedType = "King";
        amenities = ["Free Wi-Fi", "360° Skyline View", "Private Terrace", "Grand Piano", "Personal Chef", "Limousine Transfer", "Private Plunge Pool"];
        imageUrls = ["https://placehold.co/800x600/9b2226/ffffff?text=Penthouse+Suite"];
        isAvailable = true;
      },
    ];

    for (room in sampleRooms.vals()) {
      rooms.add(room.id, room);
    };
  };
};
