import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomeScreen from "./screens/welcome-screen";
import MatchesScreen from "./screens/matches-screen";
import SettingsScreen from "./screens/settings-screen";
import FireScreen from "./screens/fire-screen";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <WelcomeScreen />,
    },
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
  ]);

  return <RouterProvider router={router} />;
}

export default App;
