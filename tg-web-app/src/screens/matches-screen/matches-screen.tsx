import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import cn from "classnames";

import useWebApp from "../../queries/useWebApp";
import useFire from "../../queries/useFire";
import useRecommendations from "../../queries/useRecommendations";
import CircleButton from "./elems/circle-button";
import iconFire from "./icons/fire.svg";
import iconClock from "./icons/clock.svg";
import iconNo from "./icons/no.svg";
import iconYes from "./icons/yes.svg";
import styles from "./matches-screen.module.css";

import { type FC } from "react";

const MatchesScreen: FC = () => {
  const queryClient = useQueryClient();
  const webApp = useWebApp();
  const fire = useFire();
  const recommendations = useRecommendations();

  const isLimited = recommendations.data?.locked || false;
  const [firstPeople, secondPeople] = recommendations.data?.peoples || [];
  const count = fire.data ? fire.data.length : 0;

  const sendReaction = useCallback(
    async (reaction: "no" | "yes") => {
      webApp.HapticFeedback.selectionChanged();

      try {
        const res = await fetch("/api/send-reaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ targetUserId: firstPeople?.id, reaction }),
        });
        const result = await res.json();

        if (result.ok) {
          const data = result.data;

          queryClient.setQueryData(["recommendations"], () => {
            return {
              locked: data.locked,
              peoples: [secondPeople, data.newPeople],
            };
          });
        } else {
          throw new Error(result);
        }
      } catch (err) {
        console.error(err);
        alert("Unknown error, try later");
      }
    },
    [firstPeople, queryClient, secondPeople, webApp]
  );

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

  if (!recommendations.data) return;

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
        <img
          className={cn(styles.image, { [styles.first]: true })}
          src={firstPeople.image}
          alt=""
        />

        <img
          className={cn(styles.image, { [styles.second]: true })}
          src={secondPeople.image}
          alt=""
        />
      </div>

      <div className={styles.footer}>
        {isLimited ? (
          <div className={styles.message}>
            <p>
              You have already watched more than <span>30 people</span> today!
              I'm sure you'll be noticed soon, let's wait?
            </p>
          </div>
        ) : (
          <>
            <div className={styles.profile}>
              <div className={styles.name}>
                {`${firstPeople.firstName}, ${firstPeople.age}`}
              </div>
              <div className={styles.description}>
                {firstPeople.description}
              </div>
            </div>

            <div className={styles.buttons}>
              <CircleButton onClick={() => sendReaction("no")}>
                <img src={iconNo} alt="" />
              </CircleButton>

              <CircleButton onClick={() => sendReaction("yes")}>
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
