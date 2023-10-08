import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import StartStep from "./elems/start-step";
import MessagesStep from "./elems/messages-step";
import styles from "./welcome-screen.module.css";

import type { FC } from "react";

type Step = "start" | "messages";

const WelcomeScreen: FC = () => {
  const [step, setStep] = useState<Step>("start");
  const navigate = useNavigate();

  const handleFinish = useCallback(() => {
    navigate("/matches");
  }, [navigate]);

  return (
    <div className={styles.screen}>
      {step === "start" && <StartStep onEnd={() => setStep("messages")} />}
      {step === "messages" && <MessagesStep onEnd={handleFinish} />}
    </div>
  );
};

export default WelcomeScreen;
