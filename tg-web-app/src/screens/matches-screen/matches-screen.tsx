import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import cn from "classnames";

import useWebApp from "../../queries/useWebApp";
import useFire from "../../queries/useFire";
import useRecommendations from "../../queries/useRecommendations";
import useTranslation from "./useTranslation";
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
  const { t } = useTranslation();
  const [animation, setAnimation] = useState("none");
  const [loading, setLoading] = useState(false);

  const isLimited = recommendations.data?.locked || false;
  const [firstPeople, secondPeople] = recommendations.data?.peoples || [];
  const count = fire.data
    ? fire.data.locked.length + fire.data.opened.length
    : 0;

  const currentPeople = useMemo(() => {
    const peoples = recommendations.data?.peoples || [];

    return peoples.length > 2 ? peoples[1] : peoples[0];
  }, [recommendations.data]);

  const sendReaction = useCallback(
    async (reaction: "no" | "yes") => {
      const minTimeout = 700;
      const startTime = Date.now();

      webApp.HapticFeedback.selectionChanged();

      setAnimation(() => {
        if (reaction === "no") return "swipe-left";
        return "swipe-right";
      });
      setLoading(true);

      try {
        const res = await fetch("/api/send-reaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUsername: firstPeople.username,
            reaction,
          }),
        });
        const result = await res.json();

        if (result.ok) {
          const data = result.data;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(["recommendations"], (prev: any) => {
            return {
              locked: data.locked,
              peoples: [...prev.peoples, data.newPeople],
            };
          });
        } else {
          throw new Error(result);
        }
      } catch (err) {
        console.error(err);
        alert("Unknown error, try later");
      } finally {
        const endTime = Date.now();
        const diffTime = endTime - startTime;
        const timeout = diffTime < minTimeout ? minTimeout - diffTime : 0;

        setTimeout(() => {
          setAnimation("none");
          setLoading(false);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(["recommendations"], (prev: any) => {
            return {
              ...prev,
              peoples:
                prev.peoples.length > 2 ? prev.peoples.slice(1) : prev.peoples,
            };
          });
        }, timeout);
      }
    },
    [firstPeople, queryClient, webApp]
  );

  const handleBuyScores = useCallback(async () => {
    const res = await fetch("/api/buy-scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const result = await res.json();

    if (!result.ok) {
      alert("Unknown error, try again");
      return;
    }

    webApp.openInvoice(result.data, (status: string) => {
      if (status !== "paid") return;

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(["recommendations"], (prev: any) => {
          return { ...prev, locked: false };
        });
      }, 1000);
    });
  }, [queryClient, webApp]);

  useEffect(() => {
    const cleanup = () => {
      webApp.MainButton.hide();
      webApp.MainButton.offClick(handleBuyScores);
    };

    if (!isLimited) return cleanup();

    // Show the main button
    webApp.MainButton.show();
    webApp.MainButton.setText(t.continue);

    // Open the payment by click
    webApp.MainButton.onClick(handleBuyScores);

    return cleanup;
  }, [isLimited, handleBuyScores, webApp, t]);

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
        <div
          className={cn(styles.image, {
            [styles.first]: true,
            [styles.swipeLeft]: animation === "swipe-left",
            [styles.swipeRight]: animation === "swipe-right",
          })}
          style={{ backgroundImage: `url(${firstPeople.photo})` }}
        />

        <div
          className={cn(styles.image, { [styles.second]: true })}
          style={{ backgroundImage: `url(${secondPeople.photo})` }}
        />
      </div>

      <div className={styles.footer}>
        {isLimited ? (
          <div className={styles.message}>
            <p dangerouslySetInnerHTML={{ __html: t.limitMessage }} />
          </div>
        ) : (
          <>
            <div className={styles.profile}>
              <div className={styles.name}>
                <span>{`${currentPeople.firstName}`}</span>
              </div>
              <div className={styles.description}>
                {currentPeople.description || t.noDescription}
              </div>
            </div>

            <div className={styles.buttons}>
              <CircleButton
                disabled={loading}
                onClick={() => sendReaction("no")}
              >
                <img src={iconNo} alt="" />
              </CircleButton>

              <CircleButton
                disabled={loading}
                onClick={() => sendReaction("yes")}
              >
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
