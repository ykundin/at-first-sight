import useUser from "../../queries/useUser";

const translations = {
  en: {
    changePhoto: "Change photo",
    interests: "Interests:",
    age: "Age:",
    man: "A man",
    woman: "A woman",
    older: "53 and older",
    save: "Save changes",
    noDescription: "No description",
  },
  ru: {
    changePhoto: "Изменить фото",
    interests: "Интересуют:",
    age: "Возраст:",
    man: "Мужчины",
    woman: "Женщины",
    older: "53 и старше",
    save: "Сохранить изменения",
    noDescription: "Нет описания",
  },
};

function useTranslation() {
  const user = useUser();
  const locale = (user.data?.languageCode || "en") as "ru" | "en";

  return { t: translations[locale] };
}

export default useTranslation;
