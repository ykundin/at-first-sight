# С первого взгляда! / Детальная проработка интерфейса

На данном этапе работы нам предстоит более детально проработать уже имеющийся интерфейс. Это не повлияет на те механики, которые уже были разработаны, но добавит интерфейсу больше жизни и эмоций, чтобы сформировать у пользователей желание заглядывать в приложение почаще!

## Темы оформления

<img align="right" width="300" height="649" src="../images/interface-details/switch-themes.gif">

В современном мире огромное количество сайтов и приложений уже имеют как светлую, так и тёмную тему оформления, в том числе и Telegram. И будет не очень хорошо, если мы будем слепить пользователей темной темы своим светлым фоном.

Telegram предоставляет несколько готовых CSS-переменных, которые будут автоматически менять своё значение во время переключения темы на устройстве пользователя. Осталось лишь добавить их в приложение и использовать во время стилизации компонентов.

Для начала давайте объявим все переменные в одном файле `index.css`%

```css
:root {
  /* Custom variables */
  --app-brand-color: #fd6569;
  --app-gender-man-color: #4e92e2;
  --app-gender-woman-color: #fd6569;

  /* Default variables by Telegram */
  --app-bg-color: var(--tg-theme-bg-color);
  --app-secondary-bg-color: var(--tg-theme-secondary-bg-color);
  --app-text-color: var(--tg-theme-text-color);
  --app-hint-color: var(--tg-theme-hint-color);
  --app-link-color: var(--tg-theme-link-color);
  --app-button-color: var(--tg-theme-button-color);
  --app-button-text-color: var(--tg-theme-button-text);
}
```

А затем в коде компонента будем использовать их следующим образом, например:

```css
.component {
  color: var(--app-text-color);
  border: 1px solid var(--app-hint-color);
}
```

## Получение темы с помощью TypeScript

Довольно часто вы можете захотеть работать с темой не только на уровне CSS, но и внутри TypeScript-кода, чтобы получить текущую выбранную тему у пользователя или отдельные цвета его темы оформления. Всё это также предоставляется Telegram и описано в [официальной документации](https://core.telegram.org/bots/webapps#themeparams).

В данном приложении необходимости в этом нет, поэтому я ограничусь лишь парочкой примеров кода.

Первый — получаем текущую тему пользователя и её параметры:

```tsx
const webApp = window.Telegram.WebApp;

console.log("color scheme", webApp.colorScheme); // dark or light

console.log("params", webApp.themeParams); // {
//   bg_color: "#18222d"
//   button_color: "#2ea6ff"
//   button_text_color: "#ffffff"
//   hint_color: "#b1c3d5"
//   link_color: "#62bcf9"
//   secondary_bg_color: "#131415"
//   text_color: "#ffffff"
// }
```

А вот так можно подписаться на событие об изменении темы оформления:

```tsx
const webApp = window.Telegram.WebApp;

webApp.onEvent("themeChanged", function () {
  console.log("Current theme:", this.colorScheme);
});
```

## Тактильный отклик на действие

Ещё одна интересная возможность, которую предоставляет Telegram это работа с тактильным откликом. На компьютере вы не заметили разницы, а вот пользователи телефона почувствуют лёгкую вибрацию в ответ на действие с интерфейсом.

Например, я добавлю тактильный отклик на изменение любых параметров в настройках, а также на кнопки "Понравился" / "Не понравился" на экране поиска человека. Визуально это изменение не показать, поэтому заходите в бота с телефона и пробуйте вживую — [AtFirstSightBot](@at_first_sight_bot).

А вот так это выглядит внутри кода:

```tsx
function onClick() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const webApp = (window as any).Telegram.WebApp;
  webApp.HapticFeedback.selectionChanged();
}
```
