import { Link } from "react-router-dom";
import styles from "./settings-screen.module.css";

import type { FC } from "react";

const SettingsScreen: FC = () => {
  return (
    <div className={styles.screen}>
      <span>Settings Screen!</span>
      <Link to="/matches">Back</Link>
    </div>
  );
};

export default SettingsScreen;
