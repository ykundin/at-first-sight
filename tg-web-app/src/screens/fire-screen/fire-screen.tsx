import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PeopleCard from "./elems/people-card";
import useWebApp from "../../queries/useWebApp";
import useFire from "../../queries/useFire";
import iconFire from "./icons/fire.svg";
import styles from "./fire-screen.module.css";

import type { FC } from "react";

const FireScreen: FC = () => {
  const navigate = useNavigate();
  const webApp = useWebApp();
  const { data: fire } = useFire();

  const openedPeoples = useMemo(() => {
    return fire?.filter((people) => people.view === "opened") || [];
  }, [fire]);

  const lockedPeoples = useMemo(() => {
    return fire?.filter((people) => people.view === "locked") || [];
  }, [fire]);

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
        <div className={styles.title}>People who suit you</div>
      </div>

      <div className={styles.groups}>
        <div className={styles.group}>
          <div className={styles.items}>
            {openedPeoples.map((people) => (
              <PeopleCard key={people.id} people={people} />
            ))}
          </div>
        </div>

        {lockedPeoples.length > 0 && (
          <div className={styles.group}>
            <div className={styles.groupTitle}>Showed interest</div>
            <div className={styles.items}>
              {lockedPeoples.map((people) => (
                <PeopleCard key={people.id} people={people} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FireScreen;
