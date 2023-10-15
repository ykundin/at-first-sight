import useUser from "../../queries/useUser";

const translations = {
  en: {
    continue: "I want to continue",
    noDescription: "No description",
    limitMessage: `You have already watched more than <span>30 people</span> today! I'm sure you'll be noticed soon, let's wait?`,
  },
  ru: {
    continue: "Я хочу продолжить",
    noDescription: "Нет описания",
    limitMessage: `Вы уже посмотрели более <span>30 людей</span> сегодня! Я уверен, что кто-то из них ответит вам взаимностью, давайте подождём?`,
  },
};

function useTranslation() {
  const user = useUser();
  const locale = (user.data?.languageCode || "en") as "ru" | "en";

  return { t: translations[locale] };
}

export default useTranslation;
