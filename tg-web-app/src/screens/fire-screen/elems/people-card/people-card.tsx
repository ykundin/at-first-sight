import { useCallback } from "react";
import cn from "classnames";

import useWebApp from "../../../../queries/useWebApp";
import useTranslation from "../../useTranslation";
import styles from "./people-card.module.css";

import type { HTMLAttributes, FC } from "react";
import type { User } from "../../../../domain/user";

export interface PeopleCardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  user: User;
  locked?: boolean;
}

const PeopleCard: FC<PeopleCardProps> = (props) => {
  const { user, locked, ...restProps } = props;
  const { t } = useTranslation();
  const webApp = useWebApp();

  const handleOpenProfile = useCallback(() => {
    // Link on user, for example https://t.me/ykundin
    webApp.openTelegramLink(`https://t.me/${user.username}`);
  }, [user.username, webApp]);

  const handleUnlockUser = useCallback(async () => {
    const res = await fetch("/api/unlock-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user.username }),
    });
    const result = await res.json();

    console.log(result);
    webApp.openInvoice(result.data, (status: string) => {
      console.log(status);
    });
  }, [user.username, webApp]);

  return (
    <div
      {...restProps}
      className={cn(styles.card, { [styles.locked]: locked })}
    >
      <div className={styles.photo}>
        <img className={styles.image} src={user.photo} alt="" />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.name}>{`${user.firstName}`}</div>
          <div className={styles.description}>{user.description}</div>
        </div>

        <div className={styles.footer}>
          {locked ? (
            <span className={styles.link} onClick={handleUnlockUser}>
              {t.unlockUser}
            </span>
          ) : (
            <span className={styles.link} onClick={handleOpenProfile}>
              {t.openProfile}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
