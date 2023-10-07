import { Link } from "react-router-dom";
import styles from "./matches-screen.module.css";

import type { FC } from "react";

const MatchesScreen: FC = () => {
  return (
    <div className={styles.screen}>
      <span>Matches Screen!</span>
      <Link to="/fire">Go to fire screen</Link>
      <Link to="/settings">Go to settings screen</Link>
    </div>
  );
};

export default MatchesScreen;
