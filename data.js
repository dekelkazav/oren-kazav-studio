/* =========================================================
   קובץ התוכן של האתר – כאן עורכים פרטים, מוצרים ועבודות.
   אין צורך לגעת בקבצים האחרים כדי לעדכן תוכן.
   ========================================================= */

const SITE = {
  name: "אורן קצב",
  nameEn: "OREN KAZAV",
  tagline: "סטודיו לעיצוב ומיתוג",
  // מספר וואטסאפ בפורמט בינלאומי, בלי + ובלי 0 בהתחלה
  whatsapp: "972502774001",
  phone: "050-2774001",
  email: "",
  instagram: "https://www.instagram.com/orenkazav/",
  instagramHandle: "orenkazav",
  pickup: "איסוף עצמי מקריית אתא",
  shipping: "משלוחים עד הבית לכל הארץ",
};

/* קטגוריות הקטלוג */
const CATEGORIES = [
  { id: "holidays", name: "חגים" },
  { id: "staff",    name: "צוותים וסוף שנה" },
  { id: "events",   name: "אירועים ושמחות" },
  { id: "personal", name: "מתנות אישיות" },
  { id: "kids",     name: "ילדים" },
];

/* טכניקות (מופיעות כתגיות על המוצרים) */
const TECHNIQUES = {
  uv:      "הדפסת UV",
  engrave: "חריטה",
  print:   "הדפסה",
  foil:    "הטבעת זהב",
  design:  "עיצוב אישי",
};

/* =========================================================
   Catalog products
   image:  a single photo from images/works (file name without extension), e.g. "personal-candle".
   folder: a photo album – the name of a folder in חומרים/ (e.g. "חורף"). `npm run images`
           turns its photos into images/catalog/<id>/, and the product window shows them as a gallery.
   cover:  which photo of the album is shown first (1 = the first file in the folder).
   With neither image nor folder, the card shows a placeholder with the logo.
   ========================================================= */
const PRODUCTS = [
  {
    id: "winter",
    name: "חורף",
    folder: "חורף",
    cover: 8,
    category: "staff",
    techniques: ["uv", "print", "design"],
    desc: "מארזי חורף מחממים: כוס זכוכית או תרמוס עם שם בהדפסת UV, חליטות, מקלות קינמון ותפוזים מיובשים – באריזה מעוצבת. מתנה לצוותים, ללקוחות ולמשפחה.",
    includes: ["כוס זכוכית או תרמוס עם שם", "חליטות ותבלינים לשתייה חמה", "אריזה מעוצבת וסרט", "ברכה אישית"],
    minQty: "לפי הזמנה",
  },
  {
    id: "hanukkah",
    name: "חנוכה",
    folder: "חנוכה",
    cover: 9,
    category: "holidays",
    techniques: ["print", "uv", "design"],
    desc: "מתנות חנוכה לגנים, לבתי ספר, לצוותים ולמשפחה: קופות עם שם, ערכות צביעה, מנורות לילה ומארזי חג באריזה חגיגית.",
    includes: ["קופה או מתנה עם שם", "ערכת צביעה וטושים", "מארזי חג", "אריזה חגיגית"],
    minQty: "מיחידה אחת",
  },
  {
    id: "name-stickers",
    name: "מדבקות שם לילדים",
    folder: "מדבקות שם לילדים",
    cover: 9,
    category: "kids",
    techniques: ["print", "uv", "design"],
    desc: "מדבקות שם עמידות לציוד בית הספר והגן, בצבעים ובעיצובים לבחירה – וגם מחזיקי מפתחות מפרספקס עם שם.",
    includes: ["דף מדבקות בגדלים שונים", "עיצוב עם שם הילד/ה", "צבעים לבחירה"],
    minQty: "סט אחד",
  },
  {
    id: "perspex-signs",
    name: "שלטי פרספקס",
    folder: "שלטי פרספקס",
    cover: 4,
    category: "personal",
    techniques: ["uv", "engrave", "design"],
    desc: "שלטים מפרספקס בעיצוב אישי: שלטי לוגו לעסקים, ברכת העסק, שלטי משפחה לדלת, מזוזות ושילוט למשרד.",
    includes: ["שלט בעיצוב אישי", "התאמה ללוגו או לטקסט שלכם", "הדמיה לאישור לפני הייצור"],
    minQty: "לפי הזמנה",
  },
  {
    id: "pesach",
    name: "פסח",
    folder: "פסח",
    cover: 50,
    category: "holidays",
    techniques: ["uv", "engrave", "print", "design"],
    desc: "מארזי פסח לעובדים, ללקוחות ולמשפחה: יין, שמן זית, נרות ומטעמים לחג, לצד הגדות, קערות סדר, כיסויי מצה ומגשי במבוק בחריטה עם שם המשפחה או הלוגו.",
    includes: ["הגדה או כיסוי מצה עם שם המשפחה", "קערת סדר, מגש או לוח חרוט", "יין, שמן זית, נרות ומטעמים לחג", "אריזה חגיגית וברכה אישית"],
    minQty: "לפי הזמנה",
  },
  {
    id: "purim",
    name: "פורים",
    folder: "פורים",
    cover: 13,
    category: "holidays",
    techniques: ["print", "uv", "design"],
    desc: "משלוחי מנות בעיצוב אחיד ומותאם – בקופסאות שקופות, בשקיות ובאריזות קרטון, עם יין, עוגיות, אוזני המן וממתקים. לגן, לכיתה, לצוות, לעסק ולמשפחה.",
    includes: ["אריזה מעוצבת לפורים", "מדבקה או תגית עם שם או לוגו", "תכולה לבחירה: יין, עוגיות, ממתקים"],
    minQty: "לפי הזמנה",
  },
  {
    id: "kids-gifts",
    name: "ילדים",
    folder: "ילדים",
    cover: 28,
    category: "kids",
    techniques: ["uv", "print", "design"],
    desc: "בקבוקי שתייה, קופסאות אוכל, מחזיקי מפתחות, טושים, עפרונות ולוחות מחיקים – כולם עם שם הילד או הילדה. מתנה לתחילת שנה, לגן ולסוף שנה.",
    includes: ["בקבוק או קופסת אוכל עם שם", "מחזיק מפתחות מפרספקס עם שם", "ערכות יצירה, טושים ועפרונות עם שם", "אריזה וברכה"],
    minQty: "מיחידה אחת",
  },
  {
    id: "personal-gifts",
    name: "מתנות אישיות",
    folder: "מתנות אישיות",
    cover: 1,
    category: "personal",
    techniques: ["engrave", "uv", "foil", "design"],
    desc: "מתנות עם הקדשה אישית: \"מזמור לתודה\" ותפילות על עץ ופרספקס, סידורים ותהילים בהטבעת זהב, קרשי חיתוך חרוטים, מחזיקי מפתחות, נרות ומארזים לכל אירוע.",
    includes: ["פריט חרוט או מודפס עם שם", "סידור או תהילים בהטבעה אישית", "נרות, פרחים יבשים ואריזה", "ברכה אישית"],
    minQty: "מיחידה אחת",
  },
  {
    id: "diffuser-names",
    name: "מפיץ ריח ונר בשם אישי",
    category: "personal",
    techniques: ["uv", "engrave", "design"],
    desc: "מפיץ ריח בהדפסת UV עם השם, נר במכסה במבוק חרוט וסרט סאטן – בקופסת תצוגה שקופה.",
    includes: ["מפיץ ריח עם שם בהדפסת UV", "נר ריחני עם מכסה במבוק חרוט", "קופסה שקופה וסרט", "כרטיס ברכה"],
    minQty: "מיחידה אחת",
    image: "diffuser-names",
  },
  {
    id: "personal-candle",
    name: "מארז \"תודה\" עם נר אישי",
    category: "staff",
    techniques: ["uv", "engrave"],
    desc: "נר בכוס זכוכית עם הקדשה אישית, מכסה במבוק חרוט בשם ופרחים יבשים. מתנת תודה מושלמת לגננת ולמורה.",
    includes: ["נר עם הקדשה בהדפסת UV", "מכסה במבוק חרוט בשם", "זר פרחים יבשים", "קופסה שקופה"],
    minQty: "מיחידה אחת",
    image: "personal-candle",
  },
  {
    id: "staff-candle-boxes",
    name: "מארזי סוף שנה לצוות",
    category: "staff",
    techniques: ["engrave", "print", "design"],
    desc: "קופסאות חלון לבנות עם נרות, מגש במבוק חרוט וברכה אישית לכל איש צוות – אחידים ומרגשים.",
    includes: ["קופסת חלון עם סרט", "נרות ריחניים", "מגש במבוק עם חריטה", "ברכה מודפסת"],
    minQty: "מ-5 יחידות",
    image: "staff-candle-boxes",
  },
  {
    id: "teacher-notebooks",
    name: "מחברת אישית לצוות",
    category: "staff",
    techniques: ["print", "design"],
    desc: "מחברת מעוצבת עם השם והקדשה, עט, גיפט קארד ופרחים יבשים בקופסת קרטון טבעית.",
    includes: ["מחברת עם שם והקדשה", "עט", "מקום לגיפט קארד", "פרחים יבשים וקופסת קרפט"],
    minQty: "מיחידה אחת",
    image: "teacher-notebooks",
  },
  {
    id: "thanks-wrap",
    name: "מתנות תודה עטופות",
    category: "staff",
    techniques: ["uv", "print"],
    desc: "נר אישי, פרחים יבשים ותגית \"תודה\" בעטיפת צלופן חגיגית – פתרון מהיר ומשמח לכמויות.",
    includes: ["נר עם הקדשה", "מכסה במבוק", "פרחים יבשים", "עטיפה ותגית תודה"],
    minQty: "מ-5 יחידות",
    image: "thanks-wrap",
  },
  {
    id: "siddur-gift",
    name: "סידור בהטבעה אישית",
    category: "events",
    techniques: ["foil", "design"],
    desc: "סידור בכריכת פשתן עם שם בהטבעת זהב, באריזת קרפט עם פרחים יבשים. לבת מצווה, לכלה ולכל שמחה.",
    includes: ["סידור בכריכת פשתן", "שם בהטבעת זהב", "אריזה וסרט"],
    minQty: "מיחידה אחת",
    image: "siddur-gift",
  },
  {
    id: "siddur-box",
    name: "מארז כלה / בת מצווה",
    category: "events",
    techniques: ["foil", "engrave", "uv"],
    desc: "מארז יוקרתי בקופסה שקופה: סידור אישי, מפיץ ריח, נרות ומכסה במבוק חרוט – מתנה שנשמרת לשנים.",
    includes: ["סידור עם שם", "מפיץ ריח", "נרות", "מכסה במבוק חרוט", "פרחים יבשים"],
    minQty: "מיחידה אחת",
    image: "siddur-box",
  },
  {
    id: "challah-cards",
    name: "כרטיסים להפרשת חלה",
    category: "events",
    techniques: ["foil", "print"],
    desc: "כרטיסי תפילה בהטבעת זהב עם צמיד חוט ועין כחולה – מזכרת יפה לאורחות באירוע הפרשת חלה.",
    includes: ["כרטיס בהטבעת זהב", "צמיד חוט עם עין כחולה", "התאמה אישית של הטקסט"],
    minQty: "מ-10 יחידות",
    image: "challah-cards",
  },
  {
    id: "black-box",
    name: "מארז פרימיום בקופסה שחורה",
    category: "personal",
    techniques: ["uv", "print", "design"],
    desc: "כוס תרמית, מפיץ ריח, עט ומחברת עם שם – בקופסה שחורה עם סרט. מתאים גם כמתנה לעובדים ולקוחות.",
    includes: ["כוס תרמית", "מפיץ ריח", "עט", "מחברת אישית", "קופסה שחורה וסרט"],
    minQty: "מיחידה אחת",
    image: "black-box",
  },
  {
    id: "pink-cubes",
    name: "קוביית מתנה עם סרט ורוד",
    category: "personal",
    techniques: ["uv", "design"],
    desc: "קובייה שקופה עם נר, מפיץ ריח ושם אישי, סגורה בסרט ורוד. מתנה עדינה ליום הולדת או סתם כי בא לפנק.",
    includes: ["נר ריחני", "מפיץ ריח עם שם", "קופסה שקופה וסרט"],
    minQty: "מיחידה אחת",
    image: "pink-cubes",
  },
  {
    id: "engraved-boards",
    name: "לוח במבוק חרוט עם ברכה",
    category: "holidays",
    techniques: ["engrave", "design"],
    desc: "לוח במבוק עם ברכה או תפילה חרוטה, פרחים יבשים וסרט – מתנה לחג, לבית חדש או לאירוח.",
    includes: ["לוח במבוק עם חריטה", "פרחים יבשים", "קופסת חלון"],
    minQty: "מיחידה אחת",
    image: "engraved-boards",
  },
  {
    id: "rosh-hashana",
    name: "מארזי ראש השנה",
    category: "holidays",
    techniques: ["engrave", "uv", "design"],
    desc: "מארזי שנה טובה למשפחה, לצוות וללקוחות – דבש, פריטים חרוטים וברכה אישית.",
    includes: ["תכולה מותאמת לתקציב", "פריט חרוט / מודפס", "ברכה אישית"],
    minQty: "מיחידה אחת",
    image: "",
  },
  {
    id: "back-to-school",
    name: "מתנות תחילת שנה לילדים",
    category: "kids",
    techniques: ["uv", "print"],
    desc: "בקבוקים, קלמרים ומחברות עם שם – כדי להתחיל את השנה ברגל ימין.",
    includes: ["פריטים לבחירה", "שם הילד/ה", "אריזה"],
    minQty: "מיחידה אחת",
    image: "",
  },
];

/* =========================================================
   גלריית עבודות – פרויקטים שבוצעו (image = שם קובץ מתוך images/works)
   ========================================================= */
const GALLERY = [
  { title: "מארז כלה עם סידור אישי",       tag: "אירועים",  image: "siddur-box" },
  { title: "מפיצי ריח בשמות – סוף שנה",     tag: "צוותים",   image: "diffuser-names" },
  { title: "כרטיסי הפרשת חלה בהטבעת זהב",   tag: "אירועים",  image: "challah-cards" },
  { title: "מארז פרימיום שחור",             tag: "מתנה אישית", image: "black-box" },
  { title: "מחברות אישיות לצוות החינוכי",   tag: "צוותים",   image: "teacher-notebooks" },
  { title: "סידורים בהטבעה – בת מצווה",     tag: "אירועים",  image: "siddur-gift" },
  { title: "לוחות במבוק חרוטים",            tag: "חגים",     image: "engraved-boards" },
  { title: "קוביות מתנה בוורוד",            tag: "מתנה אישית", image: "pink-cubes" },
];

/* תמונות לרצועת האינסטגרם */
const INSTAGRAM_FEED = ["personal-candle", "staff-candle-boxes", "thanks-wrap", "siddur-box", "challah-cards", "diffuser-names"];
