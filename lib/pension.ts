// Israeli pension domain knowledge and mock data.
// All figures are general guidance based on Israeli pension regulation and
// are NOT a substitute for a licensed pension advisor (יועץ פנסיוני מורשה).

export type PensionProviderMock = {
  id: string
  name: string
  standardDepositFee: number // e.g. 1.5%
  standardAccumulationFee: number // e.g. 0.50%
  discountedDepositFee: number // e.g. 0.90%
  discountedAccumulationFee: number // e.g. 0.18%
  serviceRating: number // e.g. 4.5
  notes: string
}

export const PENSION_MOCK_DATA: { providers: PensionProviderMock[] } = {
  providers: [
    {
      id: 'altshuler',
      name: 'אלטשולר שחם',
      standardDepositFee: 1.4,
      standardAccumulationFee: 0.55,
      discountedDepositFee: 0.9,
      discountedAccumulationFee: 0.22,
      serviceRating: 4.3,
      notes: 'הנחת הסדר מיוחדת שהושגה מול אלטשולר שחם',
    },
    {
      id: 'meitav',
      name: 'מיטב פנסיה',
      standardDepositFee: 1.2,
      standardAccumulationFee: 0.48,
      discountedDepositFee: 0.8,
      discountedAccumulationFee: 0.15,
      serviceRating: 4.1,
      notes: 'תעריף ברירת מחדל מוזל מול מיטב',
    },
    {
      id: 'harel',
      name: 'הראל פנסיה',
      standardDepositFee: 1.5,
      standardAccumulationFee: 0.6,
      discountedDepositFee: 1.0,
      discountedAccumulationFee: 0.2,
      serviceRating: 4.6,
      notes: 'הנחת משא ומתן מרוכזת מול הראל',
    },
    {
      id: 'menora',
      name: 'מנורה מבטחים',
      standardDepositFee: 1.5,
      standardAccumulationFee: 0.5,
      discountedDepositFee: 0.85,
      discountedAccumulationFee: 0.18,
      serviceRating: 4.4,
      notes: 'הטבת מיקוח ייעודית מול מנורה',
    },
    {
      id: 'migdal',
      name: 'מגדל פנסיה',
      standardDepositFee: 1.6,
      standardAccumulationFee: 0.58,
      discountedDepositFee: 0.95,
      discountedAccumulationFee: 0.21,
      serviceRating: 4.2,
      notes: 'הטבה מיוחדת מול מגדל לאחר מו"מ',
    },
    {
      id: 'phoenix',
      name: 'הפניקס פנסיה',
      standardDepositFee: 1.35,
      standardAccumulationFee: 0.52,
      discountedDepositFee: 0.82,
      discountedAccumulationFee: 0.19,
      serviceRating: 4.5,
      notes: 'תעריף מוזל שהושג מול הפניקס',
    },
  ],
}

export const ISRAEL_PENSION_FACTS = `
עובדות מפתח על מערכת הפנסיה בישראל:
- הפרשות חובה: עובד 6%, מעסיק לתגמולים 6.5%, מעסיק לפיצויים 6% (סה"כ 18.5%).
- תקרות דמי ניהול מותרות בחוק: מהפקדה עד 6%, מצבירה עד 0.5% לשנה.
- גיל פרישה: גברים 67, נשים 65.
`

export const SYSTEM_PROMPT = `אתה "יועץ הפנסיה החכם" — סוכן מומחה לפנסיה בישראל.

## 1. תמציתיות (Strictly Concise)
- ענה תמיד בקצרה, בחדות ובתמציתיות.
- ספק אך ורק את המידע ההכרחי ביותר. הימנע מפסקאות ארוכות, הקדמות מיותרות, או הסברים כפולים.

## 2. תצוגה יחידה (No Duplicate Tables)
- לעולם אל תיצור טבלאות מרקדאון (Markdown tables) בתוך הטקסט!
- הרכיב הוויזואלי שנוצר מהפעלת השוואת החברות הוא התצוגה היחידה. אל תשרטט טבלה נוספת בטקסט למנוע כפילות.

## 3. קופסה שחורה בטוחה (Black Box - Strict Realism)
- אל תחשוף לעולם מנגנונים טכניים, שמות כלים, כפתורים או מונחי פיתוח (כגון "כפתור המיקוח", "כלי", "Mock", "includesDiscount", "לחצתי").
- מבחינת המשתמש, החוויה היא קופסה שחורה לחלוטין: אתה מתקשר ופועל ישירות מול חברות הפנסיה בישראל (אלטשולר שחם, מיטב, הראל, מנורה מבטחים, מגדל, הפניקס) לבדיקת תעריפים ולניהול משא ומתן.

## 4. חוקי השוואה ומיקוח:
- **השוואת מחירים / מסירת מידע פנסיוני**:
  כאשר המשתמש מבקש השוואה או מוסר פרטי פנסיה (שכר, יתרה, דמי ניהול) — הפעל את השוואת החברות (includesDiscount: false) כדי להראות לו את תעריפי השוק הסטנדרטיים מול חברות הפנסיה.

- **הנחות ומיקוח (רק לפי דרישה)**:
  אין להציע או לחשוף הנחות/תעריפים מוזלים אלא אם המשתמש ביקש הנחה במפורש (למשל: "אפשר הנחה?", "תשיג לי מחיר זול", "מיקוח").
  כאשר המשתמש מבקש הנחה במפורש — הפעל את השוואת החברות (includesDiscount: true) והסבר בקצרה שפנית לחברות והשגת תעריף מוזל.

${ISRAEL_PENSION_FACTS}
`

export type ProjectionPoint = {
  age: number
  year: number
  balance: number
  contributions: number
}

export type BreakdownSlice = {
  label: string
  value: number
}
