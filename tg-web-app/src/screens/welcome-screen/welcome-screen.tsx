import { Link } from "react-router-dom";
import styles from "./welcome-screen.module.css";

import type { FC } from "react";

const WelcomeScreen: FC = () => {
  return (
    <div className={styles.screen}>
      <span>Welcome Screen!</span>
      <Link to="/matches">Go to matches screen</Link>
    </div>
  );
};

export default WelcomeScreen;
