import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import RoomsReservationsLib "../lib/rooms-reservations";
import Types "../types/rooms-reservations";

mixin (
  accessControlState : AccessControl.AccessControlState,
  rooms : Map.Map<Types.RoomId, Types.Room>,
  reservations : Map.Map<Types.ReservationId, Types.Reservation>,
  nextReservationId : { var value : Nat },
  stripeSecretKey : { var value : ?Text },
  transform : OutCall.Transform,
) {

  // ── Public room queries ───────────────────────────────────────────────────

  public query func listRooms() : async [Types.Room] {
    RoomsReservationsLib.listRooms(rooms);
  };

  public query func checkAvailability(roomId : Types.RoomId, checkIn : Int, checkOut : Int) : async Bool {
    RoomsReservationsLib.checkAvailability(rooms, reservations, roomId, checkIn, checkOut);
  };

  // ── Guest reservation flow (no auth required) ─────────────────────────────

  public shared func createReservation(
    guestName : Text,
    guestEmail : Text,
    guestPhone : Text,
    roomId : Types.RoomId,
    checkIn : Int,
    checkOut : Int,
    numGuests : Nat,
  ) : async Types.CreateReservationResult {
    let req : Types.CreateReservationRequest = {
      guestName;
      guestEmail;
      guestPhone;
      roomId;
      checkIn;
      checkOut;
      numGuests;
    };
    let result = RoomsReservationsLib.createReservation(rooms, reservations, nextReservationId.value, req);
    switch (result) {
      case (#ok(id)) {
        nextReservationId.value += 1;
        #ok(id);
      };
      case (#err(msg)) { #err(msg) };
    };
  };

  public shared func recordDepositPaid(
    reservationId : Types.ReservationId,
    stripePaymentIntentId : Text,
  ) : async () {
    RoomsReservationsLib.recordDepositPaid(reservations, reservationId, stripePaymentIntentId);
  };

  // ── Stripe deposit PaymentIntent ──────────────────────────────────────────

  public shared func createDepositPaymentIntent(reservationId : Types.ReservationId) : async { #ok : Text; #err : Text } {
    let secretKey = switch (stripeSecretKey.value) {
      case (null) { return #err("Stripe is not configured") };
      case (?k) { k };
    };
    let reservation = switch (reservations.get(reservationId)) {
      case (null) { return #err("Reservation not found") };
      case (?r) { r };
    };
    let amountText = reservation.depositAmount.toText();
    let body = "amount=" # amountText # "&currency=usd&payment_method_types[]=card&metadata[reservation_id]=" # reservationId.toText();
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # secretKey },
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
    ];
    try {
      let responseText = await OutCall.httpPostRequest("https://api.stripe.com/v1/payment_intents", headers, body, transform);
      let clientSecret = extractJsonField(responseText, "client_secret");
      switch (clientSecret) {
        case (null) { #err("Failed to extract client_secret from Stripe response") };
        case (?secret) { #ok(secret) };
      };
    } catch (e) {
      #err("Stripe API call failed: " # e.message());
    };
  };

  // ── Staff-only endpoints ──────────────────────────────────────────────────

  public shared ({ caller }) func confirmReservation(reservationId : Types.ReservationId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff can confirm reservations");
    };
    RoomsReservationsLib.confirmReservation(reservations, reservationId);
  };

  public shared ({ caller }) func rejectReservation(reservationId : Types.ReservationId, reason : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff can reject reservations");
    };
    RoomsReservationsLib.rejectReservation(reservations, reservationId, reason);
  };

  public query ({ caller }) func listReservations() : async [Types.Reservation] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff can list all reservations");
    };
    RoomsReservationsLib.listReservations(reservations);
  };

  // ── Public single-reservation lookup (confirmation page) ──────────────────

  public query func getReservation(reservationId : Types.ReservationId) : async ?Types.Reservation {
    RoomsReservationsLib.getReservation(reservations, reservationId);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  func extractJsonField(json : Text, fieldName : Text) : ?Text {
    let patterns = ["\"" # fieldName # "\":\"", "\"" # fieldName # "\": \""];
    for (pattern in patterns.vals()) {
      if (json.contains(#text pattern)) {
        let parts = json.split(#text pattern);
        switch (parts.next()) {
          case (null) {};
          case (?_) {
            switch (parts.next()) {
              case (?afterPattern) {
                switch (afterPattern.split(#text "\"").next()) {
                  case (?value) {
                    if (value.size() > 0) {
                      return ?value;
                    };
                  };
                  case (_) {};
                };
              };
              case (null) {};
            };
          };
        };
      };
    };
    null;
  };
};
