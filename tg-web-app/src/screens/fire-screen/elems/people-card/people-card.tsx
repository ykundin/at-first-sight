import { useCallback } from "react";
import cn from "classnames";

import useWebApp from "../../../../queries/useWebApp";
import styles from "./people-card.module.css";

import type { HTMLAttributes, FC } from "react";
import type { People } from "../../../../domain/people";

export interface PeopleCardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  people: People;
  locked?: boolean;
}

const PeopleCard: FC<PeopleCardProps> = (props) => {
  const { people, locked, ...restProps } = props;
  const webApp = useWebApp();

  const handleOpenProfile = useCallback(() => {
    // Link on user, for example https://t.me/ykundin
    webApp.openTelegramLink(people.link);
  }, [people.link, webApp]);

  const handleUnlockUser = useCallback(async () => {
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
  }, [people, webApp]);

  return (
    <div
      {...restProps}
      className={cn(styles.card, { [styles.locked]: locked })}
    >
      <div className={styles.photo}>
        <img className={styles.image} src={people.photo} alt="" />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.name}>
            {`${people.firstName}, ${people.age}`}
          </div>
          <div className={styles.description}>{people.description}</div>
        </div>

        <div className={styles.footer}>
          {locked ? (
            <span className={styles.link} onClick={handleUnlockUser}>
              Unlock the user
            </span>
          ) : (
            <span className={styles.link} onClick={handleOpenProfile}>
              Open a profile
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
