import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import RadioButtons from "../../ui/radio-buttons";
import useWebApp from "../../queries/useWebApp";
import useUser from "../../queries/useUser";
import useTranslation from "./useTranslation";
import styles from "./settings-screen.module.css";

import type { ChangeEventHandler, FC, FormEventHandler } from "react";

const SettingsScreen: FC = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const webApp = useWebApp();
  const refButton = useRef<HTMLButtonElement>(null);

  const interestItems = [
    { id: "man", text: t.man },
    { id: "woman", text: t.woman },
  ];

  const ageItems = [
    { id: "14-18", text: "14-18" },
    { id: "19-23", text: "19-23" },
    { id: "24-30", text: "24-30" },
    { id: "31-36", text: "31-36" },
    { id: "37-45", text: "37-45" },
    { id: "46-53", text: "46-53" },
    { id: "older", text: t.older },
  ];

  const src = useMemo(() => {
    if (file) return URL.createObjectURL(file);

    return user.photo;
  }, [file, user.photo]);

  const handleSave = useCallback(() => {
    refButton.current?.click();
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await fetch("/api/edit-profile", {
          method: "POST",
          body: new FormData(e.currentTarget),
        });
        const result = await res.json();

        if (result.ok) {
          queryClient.invalidateQueries(["recommendations"]);
          queryClient.invalidateQueries(["user"]);
          navigate("/matches");
        } else {
          throw new Error(result);
        }
      } catch (err) {
        console.error(err);
        alert("Unknown error, try later");
      } finally {
        setLoading(false);
      }
    },
    [navigate, queryClient]
  );

  const handleChangePhoto: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const inputFile = e.target.files?.item(0);

      if (inputFile) {
        setFile(inputFile);
      }
    },
    []
  );

  useEffect(() => {
    const cleanup = () => {
      webApp.MainButton.hide();
      webApp.MainButton.offClick(handleSave);
    };

    // Show the main button
    if (!webApp.MainButton.isVisible) {
      webApp.MainButton.setText(t.save);
      webApp.MainButton.show();

      // Open the payment by click
      webApp.MainButton.onClick(handleSave);
    }

    return cleanup;
  }, [handleSave, webApp, t.save]);

  useEffect(() => {
    if (loading) {
      webApp.MainButton.showProgress();
    } else {
      webApp.MainButton.hideProgress();
    }

    return () => {
      webApp.MainButton.hideProgress();
    };
  }, [loading, webApp]);

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
    <form
      className={styles.screen}
      method="POST"
      action="/api/edit-profile"
      onSubmit={handleSubmit}
    >
      <div className={styles.photo}>
        <img className={styles.image} src={src} alt="" />
        <div className={styles.photoFooter}>
          <span className={styles.changePhoto}>{t.changePhoto}</span>
        </div>
        <input
          className={styles.upload}
          type="file"
          name="photo"
          accept="image/png, image/jpeg"
          onChange={handleChangePhoto}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.profile}>
          <div className={styles.name}>
            {`${user.firstName} ${user.lastName}, 27`}
          </div>
          <div className={styles.description}>
            {user.description || t.noDescription}
          </div>
        </div>

        <div className={styles.separator} />

        <div className={styles.content}>
          <div className={styles.group}>
            <div className={styles.label}>{t.interests}</div>
            <div className={styles.groupContent}>
              <RadioButtons
                name="interests"
                items={interestItems}
                defaultValue={user.interestsGender}
              />
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.label}>{t.age}</div>
            <div className={styles.groupContent}>
              <RadioButtons
                name="age-range"
                items={ageItems}
                defaultValue={user.ageRange}
              />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" ref={refButton} hidden>
        Submit
      </button>
    </form>
  );
};

export default SettingsScreen;
