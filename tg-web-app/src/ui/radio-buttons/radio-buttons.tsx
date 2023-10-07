import { useState } from "react";
import cn from "classnames";

import styles from "./radio-buttons.module.css";

import type { FC, HTMLAttributes } from "react";

interface Item {
  id: string;
  text: string;
}

export interface RadioButtons extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  items: Item[];
  defaultValue?: Item["id"];
}

const RadioButtons: FC<RadioButtons> = (props) => {
  const { items, defaultValue } = props;
  const [value, setValue] = useState(defaultValue);

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(styles.item, { [styles.actived]: value === item.id })}
          onClick={() => setValue(item.id)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;
