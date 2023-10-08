import { useQuery } from "@tanstack/react-query";

import type { People } from "../domain/people";

interface Result {
  locked: boolean;
  peoples: People[];
}

function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    keepPreviousData: true,
    queryFn: async () => {
      const res = await fetch(`/api/get-recommendations`);
      const result = await res.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      return result.data as Result;
    },
  });
}

export default useRecommendations;
