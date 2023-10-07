import { useCallback } from "react";

import styles from "./upload-button.module.css";

import type {
  ChangeEventHandler,
  FC,
  HTMLAttributes,
  PropsWithChildren,
} from "react";

export interface UploadButton
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    PropsWithChildren {
  className?: string;
  name: string;
  onChange?: (file: File) => void;
}

const UploadButton: FC<UploadButton> = (props) => {
  const { name, children, onChange } = props;

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const file = e.target.files?.item(0);

      if (!file) return;
      if (onChange) onChange(file);
    },
    [onChange]
  );

  const handleClick = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webApp = (window as any).Telegram.WebApp;
    webApp.HapticFeedback.selectionChanged();
  }, []);

  return (
    <div className={styles.container}>
      <input
        className={styles.control}
        name={name}
        type="file"
        accept="image/png, image/jpeg"
        onClick={handleClick}
        onChange={handleChange}
      />
      {children}
    </div>
  );
};

export default UploadButton;
