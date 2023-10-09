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

Например, я добавлю тактильный отклик на изменение любых параметров в настройках, а также на кнопки "Понравился" / "Не понравился" на экране поиска человека. Визуально это изменение не показать, поэтому заходите в бота с телефона и пробуйте вживую — [@at_first_sight_bot](https://t.me/at_first_sight_bot).

А вот так это выглядит внутри кода:

```tsx
function onClick() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const webApp = (window as any).Telegram.WebApp;
  webApp.HapticFeedback.selectionChanged();
}
```

[Посмотреть полный код](https://github.com/ykundin/at-first-sight/blob/docs/tg-web-app/src/ui/radio-buttons/radio-buttons.tsx)

## Открытие на весь экран

<img align="right" width="400" height="419" src="../images/interface-details/expand-app.png">

По умолчанию приложение открывается у пользователей не на весь экран и им необходимо самостоятельно развернуть его полностью. Но во многих случаях это всего лишь лишнее действие и Telegram позволяет сразу же открыть приложение на весь экран (разница показана на скриншоте).

Делается это довольно легко, достаточно лишь при загрузке приложения вызвать следующий код. Я предлагаю делать это в файле `App.tsx`:

```tsx
function App() {
  useEffect(() => {
    const webApp = window.Telegram.WebApp;

    webApp.ready();
    webApp.expand();
  }, []);

  const router = createBrowserRouter(...);

  return <RouterProvider router={router} />;
}
```

Разумеется, это далеко не всё, что позволяет сделать Telegram в плане интерфейса, многие вещи можно проработать и сделать гораздо удобнее, а также уже можно задуматься о том, чтобы порефакторить некоторые участки кода. Но я склоняюсь к такому подходу, чтобы сначала получить работающий вариант приложения, после чего заниматься подобными вещами.

Наше приложение сложно назвать полезным на данном этапе — оно отображает только статичную информацию. А значит, что пора приступать к разработке бэкенда, научиться получать информацию о пользователе от Telegram, сохранять в базу данных, работать с платежами внутри приложения и многое другое!

[Подготавливаем бэкенд для приложения](./06-prepare-backend.md)
