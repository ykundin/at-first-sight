# С первого взгляда! / Разрабатываем интерфейс

Это довольно большой этап разработки, в рамках которого нам с вами необходимо разработать весь интерфейс приложения и те экраны, которые были созданы на этапе дизайна приложения. Предполагается, что вы довольно хорошо знаете TypeScript и React, потому что мы не будем детально разбирать каждый из компонентов интерфейса (но вы всегда можете посмотреть финальный результат прямо в этом репозитории).

Зато мы детально разберём много интерфейсных возможностей, которые предоставляет нам Telegram:

- Работа с двумя темами — светлой и тёмной;
- Отображение основной кнопки приложения;
- Как открывать нативные попапы внутри приложения;
- Использование тактильного отклика в интерфейсе;
- Навигация между экранами приложения с помощью кнопки "Назад".

## Навигация

<video width="400" height="240" controls>
  <source src="../videos/create-interface/main-navigation.mp4" type="video/mp4">
</video>

Одна из ключевых механик, которая встречается в большинстве приложений и вебсайтов, позволяющая создавать много страниц/экранов и переходить между ними. Для этой цели я буду использовать проверенную и очень известную библиотеку — [React Router](https://reactrouter.com/en/main/start/tutorial#setup).

1. Устанавливаем библиотеку
   ```bash
   # внутри tg-web-app
   bun install react-router-dom
   ```
2. Создаём пустые экраны приложения
   Создадим внутри приложения директорию `screens`, которая будет содержать каждый экран приложения:

   - welcome-screen — знакомство и регистрация пользователя;
   - matches-screen — поиск интересных людей;
   - settings-screen — экран с настройками, редактированием профиля;
   - fire-screen — просмотр совпадений;

     [Посмотреть код](https://github.com/ykundin/at-first-sight/tree/docs/tg-web-app/src/screens)

3. Добавляем роутинг внутрь приложения
   Для этого удаляем всю шаблонную информацию из файла `./src/App.tsx` и добавляем правила роутинга, которые привязывают экран приложения к нужному адресу (адрес мы определям самостоятельно). А также желательно сразу удалить ненужный CSS-код, который был в шаблоне проекта в файлах `App.css` и `index.css`

   ```tsx
   import { createBrowserRouter, RouterProvider } from "react-router-dom";
   import WelcomeScreen from "./screens/welcome-screen";
   import MatchesScreen from "./screens/matches-screen";
   import SettingsScreen from "./screens/settings-screen";
   import FireScreen from "./screens/fire-screen";

   function App() {
     const router = createBrowserRouter([
       {
         path: "/",
         element: <WelcomeScreen />,
       },
       {
         path: "/matches",
         element: <MatchesScreen />,
       },
       {
         path: "/settings",
         element: <SettingsScreen />,
       },
       {
         path: "/fire",
         element: <FireScreen />,
       },
     ]);

     return <RouterProvider router={router} />;
   }

   export default App;
   ```

4. Добавляем ссылки на каждый экран
   А теперь протестируем, что мы можем открыть каждый экран приложения, перейдя на него по ссылке. Для этого достаточно использовать компонент `Link` из того же пакета React Router. Например, вот так:

   ```tsx
   import { Link } from "react-router-dom";
   import styles from "./matches-screen.module.css";

   import type { FC } from "react";

   const MatchesScreen: FC = () => {
     return (
       <div className={styles.screen}>
         <span>Matches Screen!</span>
         <Link to="/fire">Go to fire screen</Link>
         <Link to="/settings">Go to settings screen</Link>
       </div>
     );
   };

   export default MatchesScreen;
   ```
