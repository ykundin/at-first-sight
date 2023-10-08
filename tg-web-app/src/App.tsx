import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";

import WelcomeScreen from "./screens/welcome-screen";
import MatchesScreen from "./screens/matches-screen";
import SettingsScreen from "./screens/settings-screen";
import FireScreen from "./screens/fire-screen";
import useUser from "./queries/useUser";
import useWebApp from "./queries/useWebApp";

import type { FC } from "react";

const Root: FC = () => {
  const user = useUser();
  const webApp = useWebApp();

  useEffect(() => {
    if (user.isLoading) return;
    if (user.isError) {
      alert("Sorry! Try again later");
      return;
    }

    webApp.ready();
    webApp.expand();
  }, [user, webApp]);

  if (user.isLoading || user.isError) return null;

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
};

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryOnMount: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/matches",
          element: <MatchesScreen />,
        },
        {
          path: "/settings",
          element: <SettingsScreen />,
        },
        {
          path: "/fire",
          element: <FireScreen />,
        },
        {
          index: true,
          path: "/",
          element: <WelcomeScreen />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
