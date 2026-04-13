import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Reservation } from "../types";

type BackendActor = {
  getReservation: (id: number) => Promise<Reservation | null>;
  createReservation: (
    guestName: string,
    guestEmail: string,
    guestPhone: string,
    roomId: number,
    checkIn: bigint,
    checkOut: bigint,
    numGuests: number,
  ) => Promise<{ ok: number } | { err: string }>;
  recordDepositPaid: (
    reservationId: number,
    stripePaymentIntentId: string,
  ) => Promise<void>;
  listReservations: () => Promise<Reservation[]>;
  confirmReservation: (reservationId: number) => Promise<void>;
  rejectReservation: (reservationId: number, reason: string) => Promise<void>;
  checkAvailability: (
    roomId: number,
    checkIn: bigint,
    checkOut: bigint,
  ) => Promise<boolean>;
};

export function useReservation(reservationId: number | undefined) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Reservation | null>({
    queryKey: ["reservation", reservationId],
    queryFn: async () => {
      if (!actor || reservationId === undefined) return null;
      return (actor as unknown as BackendActor).getReservation(reservationId);
    },
    enabled: !!actor && !actorFetching && reservationId !== undefined,
  });
}

export function useListReservations() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as BackendActor).listReservations();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 15_000,
  });
}

export function useCreateReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    { ok: number } | { err: string },
    Error,
    {
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      roomId: number;
      checkIn: bigint;
      checkOut: bigint;
      numGuests: number;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as unknown as BackendActor).createReservation(
        data.guestName,
        data.guestEmail,
        data.guestPhone,
        data.roomId,
        data.checkIn,
        data.checkOut,
        data.numGuests,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useConfirmReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (reservationId) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as unknown as BackendActor).confirmReservation(
        reservationId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useRejectReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { reservationId: number; reason: string }>({
    mutationFn: async ({ reservationId, reason }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as unknown as BackendActor).rejectReservation(
        reservationId,
        reason,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useCheckAvailability(
  roomId: number | undefined,
  checkIn: Date | undefined,
  checkOut: Date | undefined,
) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: [
      "availability",
      roomId,
      checkIn?.toISOString(),
      checkOut?.toISOString(),
    ],
    queryFn: async () => {
      if (!actor || !roomId || !checkIn || !checkOut) return true;
      return (actor as unknown as BackendActor).checkAvailability(
        roomId,
        BigInt(checkIn.getTime()),
        BigInt(checkOut.getTime()),
      );
    },
    enabled: !!actor && !actorFetching && !!roomId && !!checkIn && !!checkOut,
  });
}
