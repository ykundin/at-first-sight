import { useQuery } from "@tanstack/react-query";

function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/get-user");
      const result = await res.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

export default useUser;
