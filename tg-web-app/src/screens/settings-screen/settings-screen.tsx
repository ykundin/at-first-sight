import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./settings-screen.module.css";

import type { FC } from "react";

const SettingsScreen: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webApp = (window as any).Telegram.WebApp;

    // Show the back button
    webApp.BackButton.show();

    // Hide back button by click and go to Matches screen
    webApp.BackButton.onClick(() => {
      webApp.BackButton.hide();
      navigate("/matches");
    });
  }, [navigate]);

  return (
    <div className={styles.screen}>
      <span>Settings Screen!</span>
    </div>
  );
};

export default SettingsScreen;
