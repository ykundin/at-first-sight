import { useCallback } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

import CircleButton from "./elems/circle-button";
import iconFire from "./icons/fire.svg";
import iconClock from "./icons/clock.svg";
import iconNo from "./icons/no.svg";
import iconYes from "./icons/yes.svg";
import photo from "./photo.png";
import styles from "./matches-screen.module.css";

import { type FC } from "react";

const MatchesScreen: FC = () => {
  const count = 12;

  const handleNo = useCallback(() => {
    console.log("No!");
  }, []);

  const handleYes = useCallback(() => {
    console.log("Yes!");
  }, []);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <Link
          className={cn(styles.fire, { [styles.actived]: count > 0 })}
          to="/fire"
        >
          <img className={styles.iconFire} src={iconFire} alt="" />
          {count > 0 && <div className={styles.count}>{count}</div>}
        </Link>

        <Link to="/settings">
          <img className={styles.iconClock} src={iconClock} alt="" />
        </Link>
      </div>

      <div className={styles.photo}>
        <img className={styles.image} src={photo} alt="" />
      </div>

      <div className={styles.footer}>
        <div className={styles.profile}>
          <div className={styles.name}>Olga, 26</div>
          <div className={styles.description}>
            Project manager at IT company
          </div>
        </div>

        <div className={styles.buttons}>
          <CircleButton onClick={handleNo}>
            <img src={iconNo} alt="" />
          </CircleButton>

          <CircleButton onClick={handleYes}>
            <img src={iconYes} alt="" />
          </CircleButton>
        </div>
      </div>
    </div>
  );
};

export default MatchesScreen;
