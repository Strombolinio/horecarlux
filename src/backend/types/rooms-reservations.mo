module {
  public type RoomId = Nat;
  public type ReservationId = Nat;

  public type Room = {
    id : RoomId;
    name : Text;
    description : Text;
    nightlyRate : Nat;      // in cents
    capacity : Nat;
    bedType : Text;
    amenities : [Text];
    imageUrls : [Text];
    isAvailable : Bool;
  };

  public type ReservationStatus = {
    #Pending;
    #Confirmed;
    #Rejected;
  };

  public type Reservation = {
    id : ReservationId;
    guestName : Text;
    guestEmail : Text;
    guestPhone : Text;
    roomId : RoomId;
    checkIn : Int;          // Unix timestamp (nanoseconds)
    checkOut : Int;         // Unix timestamp (nanoseconds)
    numGuests : Nat;
    totalAmount : Nat;      // in cents
    depositAmount : Nat;    // in cents
    depositPaid : Bool;
    stripePaymentIntentId : ?Text;
    status : ReservationStatus;
    createdAt : Int;
    rejectionReason : ?Text;
  };

  public type CreateReservationRequest = {
    guestName : Text;
    guestEmail : Text;
    guestPhone : Text;
    roomId : RoomId;
    checkIn : Int;
    checkOut : Int;
    numGuests : Nat;
  };

  public type CreateReservationResult = {
    #ok : ReservationId;
    #err : Text;
  };
};
