import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import RoomsReservationsApi "mixins/rooms-reservations-api";
import RoomsReservationsLib "lib/rooms-reservations";
import Types "types/rooms-reservations";

actor {
  // ── Authorization state ───────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Domain state ──────────────────────────────────────────────────────────
  let rooms = Map.empty<Types.RoomId, Types.Room>();
  let reservations = Map.empty<Types.ReservationId, Types.Reservation>();
  let nextReservationId = { var value : Nat = 1 };
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  let stripeSecretKey = { var value : ?Text = null };

  // ── Seed pre-set rooms on first run ───────────────────────────────────────
  RoomsReservationsLib.seedRooms(rooms);

  // ── HTTP transform (required for outcalls) ────────────────────────────────
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Required Stripe functions (must be in actor per linting rules) ─────────

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
    stripeSecretKey.value := ?config.secretKey;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    let cfg = switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.createCheckoutSession(cfg, caller, items, successUrl, cancelUrl, transform);
  };

  public shared func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let cfg = switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.getSessionStatus(cfg, sessionId, transform);
  };

  // ── Mixins ────────────────────────────────────────────────────────────────
  include RoomsReservationsApi(accessControlState, rooms, reservations, nextReservationId, stripeSecretKey, transform);
};
