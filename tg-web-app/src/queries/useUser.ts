import { useQuery } from "@tanstack/react-query";

function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initData = (window as any).Telegram.WebApp.initData;

      const res = await fetch(`/api/get-user`, {
        method: "POST",
        headers: {
          ContentType: "application/json",
        },
        body: JSON.stringify({ initData }),
      });
      const result = await res.json();

      if (!result.ok) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

export default useUser;
