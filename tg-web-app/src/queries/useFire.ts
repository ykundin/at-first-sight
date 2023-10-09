import { useQuery } from "@tanstack/react-query";

import type { People } from "../domain/people";

export interface Result {
  opened: People[];
  locked: People[];
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
