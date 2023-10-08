import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

import useWebApp from "../../queries/useWebApp";
import CircleButton from "./elems/circle-button";
import iconFire from "./icons/fire.svg";
import iconClock from "./icons/clock.svg";
import iconNo from "./icons/no.svg";
import iconYes from "./icons/yes.svg";
import photo from "./photo.png";
import styles from "./matches-screen.module.css";

import { type FC } from "react";

const MatchesScreen: FC = () => {
  const count = 3;
  const isLimited = false;
  const webApp = useWebApp();

  const handleNo = useCallback(() => {
    console.log("No!");
    webApp.HapticFeedback.selectionChanged();
  }, [webApp]);

  const handleYes = useCallback(() => {
    console.log("Yes!");
    webApp.HapticFeedback.selectionChanged();
  }, [webApp]);

  const handlePayment = useCallback(() => {
    console.log("Open the payment!");
  }, []);

  useEffect(() => {
    const cleanup = () => {
      webApp.MainButton.hide();
      webApp.MainButton.offClick(handlePayment);
    };

    if (!isLimited) return cleanup();

    // Show the main button
    webApp.MainButton.show();
    webApp.MainButton.setText("I want to continue");

    // Open the payment by click
    webApp.MainButton.onClick(handlePayment);

    return cleanup;
  }, [isLimited, handlePayment, webApp]);

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

      <div className={cn(styles.photo, { [styles.limited]: isLimited })}>
        <img className={styles.image} src={photo} alt="" />
      </div>

      <div className={styles.footer}>
        {isLimited ? (
          <div className={styles.message}>
            <p>
              You have already watched more than <span>50 people</span> today!
              I'm sure you'll be noticed soon, let's wait?
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MatchesScreen;
