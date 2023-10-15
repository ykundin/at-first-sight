import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StartStep from "./elems/start-step";
import MessagesStep from "./elems/messages-step";
import styles from "./welcome-screen.module.css";

import type { FC } from "react";

type Step = "start" | "messages";

const WelcomeScreen: FC = () => {
  const [step, setStep] = useState<Step>("start");
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate("/matches");
  };

  return (
    <div className={styles.screen}>
      {step === "start" && (
        <StartStep onEnd={() => setStep("messages")} onFinish={handleFinish} />
      )}
      {step === "messages" && <MessagesStep onFinish={handleFinish} />}
    </div>
  );
};

export default WelcomeScreen;
