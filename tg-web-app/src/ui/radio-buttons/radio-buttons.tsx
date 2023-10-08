import { useCallback, useState } from "react";
import cn from "classnames";

import useWebApp from "../../queries/useWebApp";
import styles from "./radio-buttons.module.css";

import type { FC, HTMLAttributes, MouseEvent } from "react";

interface Item {
  id: string;
  text: string;
}

export interface RadioButtons
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  className?: string;
  align?: "left" | "right";
  name: string;
  items: Item[];
  defaultValue?: Item["id"];
  onChange?: (e: MouseEvent, id: Item["id"]) => void;
}

const RadioButtons: FC<RadioButtons> = (props) => {
  const { name, items, defaultValue, align, onChange } = props;
  const [value, setValue] = useState(defaultValue);
  const webApp = useWebApp();

  const handleClick = useCallback(
    (e: MouseEvent, id: Item["id"]) => {
      setValue(id);
      if (onChange) onChange(e, id);

      webApp.HapticFeedback.selectionChanged();
    },
    [onChange, webApp]
  );

  return (
    <div
      className={cn(styles.container, {
        [styles.alignRight]: align == "right",
      })}
    >
      <input name={name} type="text" value={value} hidden />

      {items.map((item) => (
        <div
          key={item.id}
          className={cn(styles.item, { [styles.actived]: value === item.id })}
          onClick={(e) => handleClick(e, item.id)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;
