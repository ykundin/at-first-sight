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
