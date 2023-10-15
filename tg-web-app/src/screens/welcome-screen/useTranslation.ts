import useUser from "../../queries/useUser";

import type { Message } from "./elems/messages-step";

const translations = {
  en: {
    slogan: `I will help you <br /> find your soulmate <br /> <span>at first sight!</span>`,
    allMessages: [
      {
        id: 1,
        type: "in",
        text: "But first we need to know a little more about you",
        view: "text",
      },
      { id: 2, type: "in", text: "Select your gender, please", view: "text" },
      {
        id: 3,
        type: "out",
        view: "variants",
        field: "gender",
        variants: [
          { id: "man", text: "Man" },
          { id: "woman", text: "Woman" },
        ],
      },
      {
        id: 4,
        type: "in",
        view: "text",
        text: `Cool! Now let's decide who you want to find here`,
      },
      {
        id: 5,
        type: "out",
        view: "variants",
        field: "interests",
        variants: [
          { id: "man", text: "A man" },
          { id: "woman", text: "A woman" },
        ],
      },
      {
        id: 6,
        type: "in",
        view: "text",
        text: `No problem! And also — please specify how old you are at the moment`,
      },
      {
        id: 7,
        type: "out",
        view: "variants",
        field: "age-range",
        variants: [
          { id: "14-18", text: "14-18" },
          { id: "19-23", text: "19-23" },
          { id: "24-30", text: "24-30" },
          { id: "31-36", text: "31-36" },
          { id: "37-45", text: "37-45" },
          { id: "46-53", text: "46-53" },
          { id: "older", text: "53 and older" },
        ],
      },
      {
        id: 8,
        type: "in",
        view: "text",
        text: `And finally — choose a photo that we will show to other people`,
      },
      {
        id: 9,
        type: "out",
        view: "upload",
        field: "photo",
        text: "Select photo",
      },
      {
        id: 10,
        type: "in",
        view: "submit",
        text: `Just a second, we save your information...`,
      },
      {
        id: 10,
        type: "in",
        view: "text",
        text: `Welcome!`,
      },
    ] as Message[],
  },
  ru: {
    slogan: `I помогу тебе <br /> найти вторую половинку <br /> <span>с первого взгляда!</span>`,
    allMessages: [
      {
        id: 1,
        type: "in",
        text: "Но для начала нужно узнать о тебе немного больше",
        view: "text",
      },
      { id: 2, type: "in", text: "Укажи свой пол, пожалуйста", view: "text" },
      {
        id: 3,
        type: "out",
        view: "variants",
        field: "gender",
        variants: [
          { id: "man", text: "Мужской" },
          { id: "woman", text: "Женский" },
        ],
      },
      {
        id: 4,
        type: "in",
        view: "text",
        text: `Круто! А теперь давай решим кого будем здесь искать`,
      },
      {
        id: 5,
        type: "out",
        view: "variants",
        field: "interests",
        variants: [
          { id: "man", text: "Мужчину" },
          { id: "woman", text: "Женщину" },
        ],
      },
      {
        id: 6,
        type: "in",
        view: "text",
        text: `Без проблем! А также выбери, пожалуйста, сколько тебе лет на данный момент`,
      },
      {
        id: 7,
        type: "out",
        view: "variants",
        field: "age-range",
        variants: [
          { id: "14-18", text: "14-18" },
          { id: "19-23", text: "19-23" },
          { id: "24-30", text: "24-30" },
          { id: "31-36", text: "31-36" },
          { id: "37-45", text: "37-45" },
          { id: "46-53", text: "46-53" },
          { id: "older", text: "53 и старше" },
        ],
      },
      {
        id: 8,
        type: "in",
        view: "text",
        text: `И наконец — выбери фото, которое будет показано другим людям`,
      },
      {
        id: 9,
        type: "out",
        view: "upload",
        field: "photo",
        text: "Выбрать фото",
      },
      {
        id: 10,
        type: "in",
        view: "submit",
        text: `Секундочку, сохраняем информацию о тебе...`,
      },
      {
        id: 10,
        type: "in",
        view: "text",
        text: `Добро пожаловать!`,
      },
    ] as Message[],
  },
};

function useTranslation() {
  const user = useUser();
  const locale = (user.data?.languageCode || "en") as "ru" | "en";

  return { t: translations[locale] };
}

export default useTranslation;
