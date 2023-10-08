import { useEffect } from "react";

import useUser from "../../../../queries/useUser";
import logotype from "./images/logotype.png";
import styles from "./start-step.module.css";

import type { HTMLAttributes, FC } from "react";

export interface StartStepProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  onEnd?: () => void;
}

const StartStep: FC<StartStepProps> = (props) => {
  const { onEnd } = props;
  const user = useUser();

  console.log("user", user.data);

  useEffect(() => {
    const id = setTimeout(() => {
      if (onEnd) onEnd();
    }, 3000);

    return () => clearTimeout(id);
  }, [onEnd]);

  return (
    <div className={styles.step}>
      <div className={styles.logo}>
        <img className={styles.image} src={logotype} alt="" />
      </div>

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
