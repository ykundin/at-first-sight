import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PeopleCard from "./elems/people-card";
import useWebApp from "../../queries/useWebApp";
import useFire from "../../queries/useFire";
import useTranslation from "./useTranslation";
import iconFire from "./icons/fire.svg";
import styles from "./fire-screen.module.css";

import type { FC } from "react";

const FireScreen: FC = () => {
  const navigate = useNavigate();
  const webApp = useWebApp();
  const { data: fire } = useFire();
  const { t } = useTranslation();

  useEffect(() => {
    // Show the back button
    webApp.BackButton.show();

    // Hide back button by click and go to Matches screen
    webApp.BackButton.onClick(() => {
      webApp.BackButton.hide();
      navigate("/matches");
    });
  }, [navigate, webApp]);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <img className={styles.iconFire} src={iconFire} alt="" />
        <div className={styles.title}>{t.title}</div>
      </div>

      <div className={styles.groups}>
        <div className={styles.group}>
          <div className={styles.items}>
            {fire?.opened.map((user) => (
              <PeopleCard key={user.username} user={user} />
            ))}
          </div>
        </div>

        {(fire?.locked.length || 0) > 0 && (
          <div className={styles.group}>
            <div className={styles.groupTitle}>{t.showedInterest}</div>
            <div className={styles.items}>
              {fire?.locked.map((user) => (
                <PeopleCard key={user.username} user={user} locked />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FireScreen;
