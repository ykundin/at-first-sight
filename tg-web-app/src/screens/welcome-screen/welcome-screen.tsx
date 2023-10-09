import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import StartStep from "./elems/start-step";
import MessagesStep from "./elems/messages-step";
import styles from "./welcome-screen.module.css";

import type { FC } from "react";

type Step = "start" | "messages";

const WelcomeScreen: FC = () => {
  const [step, setStep] = useState<Step>("start");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleFinish = useCallback(() => {
    queryClient.invalidateQueries(["user"]);
    navigate("/matches");
  }, [navigate, queryClient]);

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
