/* global use, db */

db.auth("kundin", "very-secret-password");
db = db.getSiblingDB("at-first-sight");

db.users.insertMany([
  {
    id: 1,
    firstName: "Olga",
    age: 26,
    description: "Project manager at IT company",
    photo:
      "https://i.pinimg.com/736x/07/e1/2c/07e12ce93307d98b5bb175b77f42db16.jpg",
    link: "https://t.me/ykundin",
    gender: "woman",
    interestsGender: "man",
    ageRange: "19-23",
    restScores: 30,
  },
  {
    id: 2,
    firstName: "Alena",
    age: 27,
    description: "I love dogs and you!",
    photo:
      "https://yobte.ru/uploads/posts/2019-11/devushki-s-sobakami-123-foto-90.jpg",
    link: "https://t.me/ykundin",
    gender: "woman",
    interestsGender: "man",
    ageRange: "24-30",
    restScores: 30,
  },
  {
    id: 3,
    firstName: "Marina",
    age: 21,
    description: "...",
    photo:
      "https://cdn.fishki.net/upload/post/2018/09/11/2700760/fbb295b87fd59ece894ffbe94a485313.jpg",
    link: "https://t.me/ykundin",
    gender: "woman",
    interestsGender: "man",
    ageRange: "19-23",
    restScores: 30,
  },
  {
    id: 4,
    firstName: "Irina",
    age: 34,
    description: "Time Is Precious. Waste It Wisely.",
    photo:
      "https://sun9-22.userapi.com/impg/zdGTX6aCVkgs9QmKgt7ppeuBA5AykkKCzvS55g/pKrIQxTXHkU.jpg?size=1620x2160&quality=95&sign=fd74ce6d119797591981cb18a9b7daa0&c_uniq_tag=kkfFQYhFoNvdIsvZ8VlSKK9ZURe8kIcJpYH1PEu0ne8&type=album",
    link: "https://t.me/ykundin",
    gender: "woman",
    interestsGender: "man",
    ageRange: "31-36",
    restScores: 30,
  },
  {
    id: 5,
    firstName: "Emily",
    age: 22,
    description: "Life Is Short. Smile While You Still Have Teeth",
    photo:
      "https://bloknot.ru/wp-content/uploads/2023/10/photo_2023-10-08_12-24-01-673x800.jpg",
    link: "https://t.me/ykundin",
    gender: "woman",
    interestsGender: "man",
    ageRange: "19-23",
    restScores: 30,
  },
  {
    id: 6,
    firstName: "Annie",
    age: 22,
    description: "When Life Gives You Lemons, Squirt Someone In The Eye",
    photo:
      "https://sun9-48.userapi.com/s/v1/ig2/D6Bxz9sDZk3qLNg6b-mUUrUPbYuAUyJU8r-wjTc-AVYvWtu7AOYKMkKBtlzGWJjJqg_auCbmhBxocl7PBNXODKB9.jpg?size=400x598&quality=95&crop=108,256,1539,2304&ava=1",
    link: "https://t.me/ykundin",
    gender: "woman",
    interestsGender: "man",
    ageRange: "19-23",
    restScores: 30,
  },
  {
    id: 7,
    firstName: "Felicia",
    age: 26,
    description: "Life is full of questions. Idiots are full of answers",
    photo:
      "https://sun1-96.userapi.com/s/v1/ig2/wLciFD9hRaf15UIcwbMRFfWaTBLYos1aormE-dhEhi1d9rRBXQFS4v9o0ALenl-3BwyhgM-Thg5xPmoKIf8LnISE.jpg?size=400x599&quality=96&crop=2,29,935,1402&ava=1",
    link: "https://t.me/ykundin",
    gender: "woman",
    interestsGender: "man",
    ageRange: "24-30",
    restScores: 30,
  },
]);
