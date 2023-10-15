import useUser from "../../queries/useUser";

const translations = {
  en: {
    title: "People who suit you",
    showedInterest: "Showed interest",
    openProfile: "Open a profile",
    unlockUser: "Unlock the user",
  },
  ru: {
    title: "Люди, которые вам подходят",
    showedInterest: "Проявили интерес",
    openProfile: "Открыть профиль",
    unlockUser: "Разблокировать",
  },
};

function useTranslation() {
  const user = useUser();
  const locale = (user.data?.languageCode || "en") as "ru" | "en";

  return { t: translations[locale] };
}

export default useTranslation;
