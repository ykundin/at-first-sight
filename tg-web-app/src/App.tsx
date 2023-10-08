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

import type { FC } from "react";
import useUser from "./queries/useUser";

const Root: FC = () => {
  const user = useUser();

  useEffect(() => {
    if (user.isLoading) return;
    if (user.isError) {
      alert("Sorry! Try again later");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webApp = (window as any).Telegram.WebApp;

    webApp.ready();
    webApp.expand();
  }, [user]);

  if (user.isLoading || user.isError) return null;

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
};

function App() {
  const queryClient = new QueryClient();
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
