/* global use, db */

db.auth("kundin", "very-secret-password");
db = db.getSiblingDB("at-first-sight");

db.users.insertMany([
  // Women
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

  // Men
  {
    id: 8,
    firstName: "Pavel",
    age: 26,
    description: "As Usual, There Is A Great Woman Behind Every Idiot",
    photo:
      "https://photo7.wambacdn.net/12/95/51/1697155921/2037850560_huge.jpg?hash=FMuslmPsXR2rVnpPDS-8Xw&expires=64060578000&updated=1597257207",
    link: "https://t.me/ykundin",
    gender: "man",
    interestsGender: "woman",
    ageRange: "24-30",
    restScores: 30,
  },
  {
    id: 9,
    firstName: "Arthur",
    age: 24,
    description: "I am not stubborn, I am just always right.",
    photo:
      "https://sun9-4.userapi.com/impg/msvX3xWErduMIK5Z97lMCaEr11FY-EUeNOyhMg/pM5Uqnm5IKk.jpg?size=890x1080&quality=96&sign=30c4dc2210eeea674cd760b5912f9087&c_uniq_tag=Oe5PtjjPnPmb_4ReynkMXNsRCBT9KFprYfEk0hDvb0s&type=album",
    link: "https://t.me/ykundin",
    gender: "man",
    interestsGender: "woman",
    ageRange: "24-30",
    restScores: 30,
  },
  {
    id: 10,
    firstName: "James",
    age: 27,
    description: "I need 6 months’ vacation, twice a year.",
    photo:
      "https://sun9-80.userapi.com/impg/oWG5QZuN2mIT0O3TgKj8o6OkH0fODPile8AqZw/-Bzl-0MHRik.jpg?size=340x604&quality=95&sign=2b8423abf2615fef889291fb2df74b3b&c_uniq_tag=zYKoTr2NqJ3TotngMVaOblygOrbCOUPUODcrQFKdpuU&type=album",
    link: "https://t.me/ykundin",
    gender: "man",
    interestsGender: "woman",
    ageRange: "24-30",
    restScores: 30,
  },
  {
    id: 11,
    firstName: "Alexander",
    age: 34,
    description: "The secret of a happy marriage remains a secret.",
    photo: "https://bestnokia.ru/wp-content/uploads/2023/02/2932644748.jpg",
    link: "https://t.me/ykundin",
    gender: "man",
    interestsGender: "woman",
    ageRange: "31-36",
    restScores: 30,
  },
  {
    id: 12,
    firstName: "Logan",
    age: 32,
    description:
      "The first five days after the weekend are always the hardest.",
    photo:
      "https://www.dr-ambrosius.de/wp-content/uploads/2018/05/dr-ambrosius-Erfolgsgeschichten-Timo.jpg",
    link: "https://t.me/ykundin",
    gender: "man",
    interestsGender: "woman",
    ageRange: "31-36",
    restScores: 30,
  },
]);
