import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import cn from "classnames";

import RadioButtons from "../../../../ui/radio-buttons";
import UploadButton from "../../../../ui/upload-button";
import useTranslation from "../../useTranslation";
import useWebApp from "../../../../queries/useWebApp";
import styles from "./messages-step.module.css";

import type { HTMLAttributes, FC, FormEventHandler } from "react";

export interface MessagesStepProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  onFinish?: () => void;
}

interface Variant {
  id: string;
  text: string;
}

interface TextMessage {
  id: number;
  type: "in" | "out";
  view: "text" | "submit";
  text: string;
}

interface VariantsMessage {
  id: number;
  type: "in" | "out";
  view: "variants";
  field: string;
  variants: Variant[];
}

interface UploadMessage {
  id: number;
  type: "in" | "out";
  view: "upload";
  field: string;
  text: string;
}

export type Message = TextMessage | VariantsMessage | UploadMessage;

interface MessageComponentProps<T> extends HTMLAttributes<HTMLDivElement> {
  message: T;
  onEnd?: (message: T) => void;
}

const TextMessage: FC<MessageComponentProps<TextMessage>> = (props) => {
  const { message, onEnd } = props;

  useEffect(() => {
    const id = setTimeout(() => {
      if (onEnd) onEnd(message);
    }, 1000);

    return () => clearTimeout(id);
  }, [onEnd, message]);

  return <div className={styles.textMessage}>{message.text}</div>;
};

const VariantsMessage: FC<MessageComponentProps<VariantsMessage>> = (props) => {
  const { message, onEnd } = props;

  const handleChange = useCallback(() => {
    setTimeout(() => {
      if (onEnd) onEnd(message);
    }, 1000);
  }, [message, onEnd]);

  return (
    <div className={styles.variantsMessage}>
      <RadioButtons
        name={message.field}
        items={message.variants}
        align={message.type === "in" ? "left" : "right"}
        onChange={handleChange}
      />
    </div>
  );
};

const UploadMessage: FC<MessageComponentProps<UploadMessage>> = (props) => {
  const { message, onEnd } = props;
  const [file, setFile] = useState<File | null>(null);

  const handleChange = useCallback(
    (file: File) => {
      setFile(file);

      setTimeout(() => {
        if (onEnd) onEnd(message);
      }, 1000);
    },
    [message, onEnd]
  );

  return (
    <div className={styles.uploadMessage}>
      <UploadButton name={message.field} onChange={handleChange}>
        {message.text}
      </UploadButton>

      {file && (
        <div className={styles.uploadMessagePreview}>
          <img
            className={styles.uploadMessageImage}
            src={URL.createObjectURL(file)}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

const MessagesStep: FC<MessagesStepProps> = (props) => {
  const { onFinish } = props;
  const { t } = useTranslation();
  const [index, setIndex] = useState(1);
  const queryClient = useQueryClient();
  const refButton = useRef<HTMLButtonElement>(null);
  const webApp = useWebApp();
  const initData = webApp.initData;

  const messages = t.allMessages.slice(0, index);

  const handleNextMessage = useCallback(
    (message: Message) => {
      const nextIndex = message.id + 1;

      if (index >= nextIndex) return;

      setIndex(message.id + 1);
    },
    [index]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const res = await fetch("/api/registration", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const result = await res.json();

      if (result.ok) {
        setIndex((p) => p + 1);

        queryClient.setQueryData(["user"], () => {
          return result.data;
        });

        setTimeout(() => {
          if (onFinish) onFinish();
        }, 1000);
      }
    },
    [onFinish, queryClient]
  );

  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 10000 });
  }, [index]);

  return (
    <form
      className={styles.step}
      method="POST"
      action="/api/registration"
      onSubmit={handleSubmit}
    >
      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            className={cn(styles.message, {
              [styles.in]: message.type === "in",
              [styles.out]: message.type === "out",
            })}
            key={message.id}
          >
            <div className={styles.messageContent}>
              {message.view === "text" && (
                <TextMessage message={message} onEnd={handleNextMessage} />
              )}

              {message.view === "submit" && (
                <TextMessage
                  message={message}
                  onEnd={() => refButton.current?.click()}
                />
              )}

              {message.view === "variants" && (
                <VariantsMessage message={message} onEnd={handleNextMessage} />
              )}

              {message.view === "upload" && (
                <UploadMessage message={message} onEnd={handleNextMessage} />
              )}
            </div>
          </div>
        ))}
      </div>

      <input type="text" name="initData" value={initData} hidden />

      <button type="submit" ref={refButton} hidden>
        Submit
      </button>
    </form>
  );
};

export default MessagesStep;
