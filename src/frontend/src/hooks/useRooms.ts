import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Room } from "../types";

export function useRooms() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      // Cast to extended interface once backend methods are generated
      const result = await (
        actor as unknown as { listRooms: () => Promise<Room[]> }
      ).listRooms();
      return result;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });
}
