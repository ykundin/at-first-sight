import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PeopleCard from "./elems/people-card";
import useWebApp from "../../queries/useWebApp";
import iconFire from "./icons/fire.svg";
import firstImage from "./images/first.jpg";
import secondImage from "./images/second.png";
import thirdImage from "./images/third.png";
import styles from "./fire-screen.module.css";

import type { FC } from "react";

const peoples = {
  opened: [
    {
      id: 1,
      firstName: "Olga",
      age: 26,
      description: "Project manager at IT company",
      view: "opened",
      image: firstImage,
      link: "https://t.me/ykundin",
    },
    {
      id: 2,
      firstName: "Alena",
      age: 27,
      description: "I love dogs and you!",
      view: "opened",
      image: secondImage,
      link: "https://t.me/ykundin",
    },
  ],
  closed: [
    {
      id: 3,
      firstName: "Victoria",
      age: 23,
      description: "I keep my secrets carefully",
      view: "locked",
      image: thirdImage,
      link: "https://t.me/ykundin",
    },
  ],
};

const FireScreen: FC = () => {
  const navigate = useNavigate();
  const webApp = useWebApp();

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
            {peoples.opened.map((people) => (
              <PeopleCard key={people.id} people={people} />
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.groupTitle}>Showed interest</div>
          <div className={styles.items}>
            {peoples.closed.map((people) => (
              <PeopleCard key={people.id} people={people} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireScreen;
