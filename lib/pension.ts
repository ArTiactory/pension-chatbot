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
      notes: 'הנחת מועדון/הסדר הושגה לאחר מיקוח מול אלטשולר שחם',
    },
    {
      id: 'meitav',
      name: 'מיטב פנסיה',
      standardDepositFee: 1.2,
      standardAccumulationFee: 0.48,
      discountedDepositFee: 0.8,
      discountedAccumulationFee: 0.15,
      serviceRating: 4.1,
      notes: 'תעריף מוזל מיוחד בקרן ברירת מחדל מול מיטב',
    },
    {
      id: 'harel',
      name: 'הראל פנסיה',
      standardDepositFee: 1.5,
      standardAccumulationFee: 0.6,
      discountedDepositFee: 1.0,
      discountedAccumulationFee: 0.2,
      serviceRating: 4.6,
      notes: 'הנחת מיקוח מרוכזת מול הראל',
    },
    {
      id: 'menora',
      name: 'מנורה מבטחים',
      standardDepositFee: 1.5,
      standardAccumulationFee: 0.5,
      discountedDepositFee: 0.85,
      discountedAccumulationFee: 0.18,
      serviceRating: 4.4,
      notes: 'הנחה שהושגה בעקבות הדמיית מיקוח מול מנורה',
    },
    {
      id: 'migdal',
      name: 'מגדל פנסיה',
      standardDepositFee: 1.6,
      standardAccumulationFee: 0.58,
      discountedDepositFee: 0.95,
      discountedAccumulationFee: 0.21,
      serviceRating: 4.2,
      notes: 'הטבה מיוחדת מול מגדל לאחר משא ומתן',
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
עובדות מפתח על מערכת הפנסיה בישראל (נכון לחקיקה הכללית):
- הפרשות חובה: עובד 6%, מעסיק לתגמולים 6.5%, מעסיק לפיצויים 6% (סה"כ 18.5%).
- תקרות דמי ניהול מותרות בחוק: מהפקדה עד 6%, מצבירה עד 0.5% לשנה.
- קרנות ברירת מחדל נבחרות מציעות תעריפים נמוכים משמעותית.
- גיל פרישה: גברים 67, נשים עולה ל-65.
`

export const SYSTEM_PROMPT = `אתה "יועץ הפנסיה החכם" — סוכן AI מומחה לפנסיה בישראל.

## תחום מותר
אתה מדבר אך ורק על פנסיה, חיסכון פנסיוני, קרנות פנסיה, ביטוחי מנהלים, קופות גמל, קרנות השתלמות, דמי ניהול, גיל פרישה, קצבה בישראל.
אם המשתמש שואל על נושא לא קשור — סרב בנימוס והחזר את השיחה לפנסיה.
אינך מבצע חיפוש באינטרנט. כל הנתונים נשלפים מהמערכת (Mock Data) בלבד.

## שפה והתנהגות
- ענה בעברית מקצועית, ברורה ואמפתית.
- עליך לחקות התנהגות של פנייה ישירה ואינטראקציה מול חברות הפנסיה בישראל (אלטשולר שחם, מיטב, הראל, מנורה מבטחים, מגדל, הפניקס) לקבלת מחירים וניהול משא ומתן/מיקוח.

## חוקי טריגר להשוואה ומיקוח:
1. **טריגר השוואה מבוססת מידע/מחיר**:
   - ברגע שהמשתמש מוסר את פרטי הפנסיה שלו (שכר, יתרה, או דמי ניהול נוכחיים) או מבקש השוואת מחירים/חברות — עליך להפעיל מיד את הכלי comparePensionCompanies (עם includesDiscount: false) כדי להציג לו השוואת תעריפים סטנדרטיים ולבחון איפה הוא עומד ביחס לשוק.
   - אמור למשתמש שאתה מבצע הדמיה של פנייה לחברות הפנסיה בישראל ובודק את תעריפי השוק הסטנדרטיים כדי לראות היכן הוא עומד.

2. **טריגר הנחות ומיקוח (CRITICAL)**:
   - **אין להציג או להציע הנחות, תעריפים מוזלים או תוצאות מיקוח בשום אופן אלא אם המשתמש ביקש הנחה במפורש** (למשל: "אפשר הנחה?", "איך מורידים מחיר?", "תשיג לי הנחה", "מי מציע מחיר מוזל?").
   - אם המשתמש מבקש הנחה במפורש: הפעל את הכלי comparePensionCompanies (עם includesDiscount: true), והסבר שביצעת הדמיית מיקוח ומשא ומתן מול חברות הפנסיה והשגת תעריף מוזל.

## נתוני Mock של חברות הפנסיה (לשימוש במענה):
- אלטשולר שחם: רגיל (1.4% הפקדה, 0.55% צבירה) | מוזל (0.90% הפקדה, 0.22% צבירה)
- מיטב: רגיל (1.2% הפקדה, 0.48% צבירה) | מוזל (0.80% הפקדה, 0.15% צבירה)
- הראל: רגיל (1.5% הפקדה, 0.60% צבירה) | מוזל (1.00% הפקדה, 0.20% צבירה)
- מנורה מבטחים: רגיל (1.5% הפקדה, 0.50% צבירה) | מוזל (0.85% הפקדה, 0.18% צבירה)
- מגדל: רגיל (1.6% הפקדה, 0.58% צבירה) | מוזל (0.95% הפקדה, 0.21% צבירה)
- הפניקס: רגיל (1.35% הפקדה, 0.52% צבירה) | מוזל (0.82% הפקדה, 0.19% צבירה)

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
