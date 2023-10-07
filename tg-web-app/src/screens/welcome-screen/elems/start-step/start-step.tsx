import styles from "./start-step.module.css";

import { type HTMLAttributes, type FC, useEffect } from "react";

export interface StartStepProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  onEnd?: () => void;
}

const StartStep: FC<StartStepProps> = (props) => {
  const { onEnd } = props;

  useEffect(() => {
    const id = setTimeout(() => {
      if (onEnd) onEnd();
    }, 2000);

    return () => clearTimeout(id);
  }, [onEnd]);

  return (
    <div className={styles.step}>
      <div className={styles.logo} />
      <div className={styles.text}>
        I will help you
        <br />
        find your soulmate
        <br />
        <span>at first sight!</span>
      </div>
    </div>
  );
};

export default StartStep;
