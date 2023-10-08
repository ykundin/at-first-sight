import { useCallback } from "react";
import cn from "classnames";

import styles from "./people-card.module.css";

import type { HTMLAttributes, FC } from "react";
import type { People } from "../../../../domain/people";

export interface PeopleCardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  people: People;
}

const PeopleCard: FC<PeopleCardProps> = (props) => {
  const { people, ...restProps } = props;

  const handleOpenProfile = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webApp = (window as any).Telegram.WebApp;

    // Link on user, for example https://t.me/ykundin
    webApp.openTelegramLink(people.link);
  }, [people.link]);

  const handleUnlockUser = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webApp = (window as any).Telegram.WebApp;

    const res = await fetch("/api/unlock-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: people.id }),
    });
    const result = await res.json();

    console.log(result);
    webApp.openInvoice(result.data, (status: string) => {
      console.log(status);
    });
  }, [people]);

  return (
    <div
      {...restProps}
      className={cn(styles.card, { [styles.locked]: people.view === "locked" })}
    >
      <div className={styles.photo}>
        <img className={styles.image} src={people.image} alt="" />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.name}>
            {`${people.firstName}, ${people.age}`}
          </div>
          <div className={styles.description}>{people.description}</div>
        </div>

        <div className={styles.footer}>
          {people.view === "opened" ? (
            <span className={styles.link} onClick={handleOpenProfile}>
              Open a profile
            </span>
          ) : (
            <span className={styles.link} onClick={handleUnlockUser}>
              Unlock the user
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
