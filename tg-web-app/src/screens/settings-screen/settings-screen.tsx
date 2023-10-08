import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import RadioButtons from "../../ui/radio-buttons";
import useWebApp from "../../queries/useWebApp";
import photo from "./images/photo.png";
import styles from "./settings-screen.module.css";

import type { FC } from "react";

const interestItems = [
  { id: "man", text: "A man" },
  { id: "woman", text: "A woman" },
];

const ageItems = [
  { id: "14-18", text: "14-18" },
  { id: "19-23", text: "19-23" },
  { id: "24-30", text: "24-30" },
  { id: "31-36", text: "31-36" },
  { id: "37-45", text: "37-45" },
  { id: "46-53", text: "46-53" },
  { id: "older", text: "53 and older" },
];

const SettingsScreen: FC = () => {
  const navigate = useNavigate();
  const webApp = useWebApp();

  const handleSave = useCallback(() => {
    console.log("Save the changes...");
    navigate("/matches");
  }, [navigate]);

  useEffect(() => {
    const cleanup = () => {
      webApp.MainButton.hide();
      webApp.MainButton.offClick(handleSave);
    };

    // Show the main button
    if (!webApp.MainButton.isVisible) {
      webApp.MainButton.setText("Save changes");
      webApp.MainButton.show();

      // Open the payment by click
      webApp.MainButton.onClick(handleSave);
    }

    return cleanup;
  }, [handleSave, webApp]);

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
      <div className={styles.photo}>
        <img className={styles.image} src={photo} alt="" />
        <div className={styles.photoFooter}>
          <span className={styles.changePhoto}>Change photo</span>
        </div>
        <input
          className={styles.upload}
          type="file"
          accept="image/png, image/jpeg"
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.profile}>
          <div className={styles.name}>Yury Kundin, 27</div>
          <div className={styles.description}>Work smart, not hard</div>
        </div>

        <div className={styles.separator} />

        <div className={styles.content}>
          <div className={styles.group}>
            <div className={styles.label}>Interests:</div>
            <div className={styles.groupContent}>
              <RadioButtons
                name="gender"
                items={interestItems}
                defaultValue="man"
              />
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.label}>Age:</div>
            <div className={styles.groupContent}>
              <RadioButtons
                name="age-range"
                items={ageItems}
                defaultValue="24-30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
