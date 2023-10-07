import styles from "./circle-button.module.css";

import type { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

export interface CircleButtonProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const CircleButton: FC<CircleButtonProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button {...restProps} type="button" className={styles.button}>
      {children}
    </button>
  );
};

export default CircleButton;
