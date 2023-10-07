import { Link } from "react-router-dom";
import styles from "./fire-screen.module.css";

import type { FC } from "react";

const FireScreen: FC = () => {
  return (
    <div className={styles.screen}>
      <span>Fire Screen!</span>
      <Link to="/matches">Back</Link>
    </div>
  );
};

export default FireScreen;
