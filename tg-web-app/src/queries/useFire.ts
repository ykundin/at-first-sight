import { useQuery } from "@tanstack/react-query";

import type { User } from "../domain/user";

export interface Result {
  opened: User[];
  locked: User[];
}

function useFire() {
  return useQuery({
    queryKey: ["fire"],
    keepPreviousData: true,
    queryFn: async () => {
      const res = await fetch(`/api/get-fire`);
      const result = await res.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      return result.data as Result;
    },
  });
}

export default useFire;
