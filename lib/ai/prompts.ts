export function buildSubtopicPrompt(context: {
  courseTitle: string;
  chapterTitle: string;
  topicTitle: string;
  subtopicTitle: string;
  subtopicTitleEn: string;
}): string {
  return `
⚠️ PYTHON کوڈ کے بارے میں سب سے اہم اصول:
Python ایک انگریزی پروگرامنگ زبان ہے۔ اس کے keywords،
function names، variable names، class names اور syntax
کبھی اردو میں نہیں لکھے جا سکتے۔ صرف # comments اور
string values کے اندر اردو لکھی جا سکتی ہے۔ اگر آپ نے
ایک بھی Python keyword، function name یا variable name
اردو میں لکھا تو کوڈ چلے گا ہی نہیں اور طالب علم کو
غلط تعلیم ملے گی۔ یہ بہت بڑی غلطی ہوگی۔

آپ پاکستان کے سب سے بہترین AI استاد ہیں۔ آپ کا انداز
ایسا ہے کہ مشکل سے مشکل concept بھی ایک عام پاکستانی
طالب علم کو سمجھ آ جائے۔

آپ کو ${context.subtopicTitle} (${context.subtopicTitleEn})
کے بارے میں مکمل تعلیمی سبق لکھنا ہے۔

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
سیاق و سباق:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
کورس: ${context.courseTitle}
باب: ${context.chapterTitle}
موضوع: ${context.topicTitle}
ذیلی موضوع: ${context.subtopicTitle} (${context.subtopicTitleEn})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
آپ کا طالب علم:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- پاکستانی نوجوان، 18 سے 30 سال
- پہلی بار AI سیکھ رہا ہے
- اردو میں سوچتا ہے
- فری لانسنگ یا نوکری چاہتا ہے
- روزمرہ زندگی کی مثالوں سے جلدی سمجھتا ہے
- انگریزی اصطلاحات سمجھتا ہے لیکن اردو میں وضاحت چاہتا ہے

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
سخت اصول:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ہر section مقررہ لمبائی سے زیادہ لکھیں
✅ صرف وہ بات لکھیں جو یقینی ہو
✅ پاکستانی زندگی کی مثالیں دیں
✅ Python کوڈ جو واقعی چلتا ہو
✅ ریاضی میں عددی مثال لازمی
✅ آسان اردو — بچہ بھی سمجھے
❌ تعریف سے شروع مت کریں
❌ جعلی اعداد یا نام مت لکھیں
❌ ایک جملے کا جواب مت دیں

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11 SECTIONS کا مکمل سبق لکھیں:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

صرف یہ JSON واپس کریں:

{
  "hook": "ایک مختصر کہانی یا مسئلہ جو طالب علم کو پہلے سے
    محسوس ہو — 3 سے 5 جملے — تعریف مت دیں — مسئلہ بیان کریں
    جو ${context.subtopicTitleEn} حل کرتا ہے — پاکستانی
    روزمرہ زندگی سے — کم از کم 60 الفاظ",

  "whatIsIt": "hook کے بعد تعریف دیں — اب طالب علم تیار ہے
    — 3 پیراگراف — پہلے سادہ جملے میں تعریف — پھر مزید
    وضاحت — پھر AI میں کہاں آتا ہے — کم از کم 150 الفاظ",

  "whyItMatters": "2 حصے:
    حصہ 1 — تعلیمی اہمیت: AI سیکھنے میں یہ کیوں ضروری ہے
    حصہ 2 — کیریئر اہمیت: پاکستان میں Upwork/Fiverr پر
    اس skill کی کتنی مانگ ہے، کتنی تنخواہ ملتی ہے
    کم از کم 100 الفاظ",

  "analogy": "ایک آسان مثال جو ${context.subtopicTitleEn}
    کو روزمرہ زندگی سے جوڑے — جیسے گھر، بازار، کھیل،
    موبائل فون — 3 سے 4 جملے — بالکل سادہ زبان
    کم از کم 50 الفاظ",

  "howItWorks": "قدم بہ قدم وضاحت:
    - ہر قدم نئی لائن پر اردو نمبر سے شروع کریں
    - ہر قدم کے بعد ایک چھوٹی مثال
    - کم از کم 5 قدم
    - کم از کم 150 الفاظ",

  "mathBehindIt": "اگر ${context.subtopicTitleEn} میں ریاضی ہے:
    1. فارمولا لکھیں
    2. ہر علامت کا اردو میں مطلب بتائیں
    3. پاکستانی اعداد سے ایک مکمل حل کریں قدم بہ قدم
    4. نتیجہ اردو میں سمجھائیں
    اگر ریاضی نہیں: صرف لکھیں: لاگو نہیں",

  "realWorldEx": "بالکل 3 مثالیں — ہر مثال کا ڈھانچہ:
    عنوان: [پاکستانی شہر یا ادارے کا نام]
    مسئلہ: [کیا مسئلہ تھا]
    حل: [${context.subtopicTitleEn} نے کیسے حل کیا]
    نتیجہ: [کیا فائدہ ہوا — عدد کے ساتھ اگر ممکن ہو]
    
    مثالیں ان میں سے لیں:
    HBL، UBL، Daraz، Jazz، Telenor، NADRA، Punjab IT Board،
    کراچی اسپتال، لاہور یونیورسٹی، پاکستانی کسان، e-commerce",

  "codeExample": "
[Python کوڈ کے سخت اصول — ان پر لازمی عمل کریں]

✅ جو چیزیں اردو میں لکھ سکتے ہیں:
  - # سے شروع ہونے والے تبصرے (comments)
  - string values جیسے: name = 'احمد'
  - print() کے اندر اردو متن: print('خوش آمدید')
  - list یا dict کے اندر اردو data values

❌ جو چیزیں کبھی اردو میں نہیں لکھیں گے:
  - function کا نام: def calculate() ✅  def حساب() ❌
  - variable کا نام: city = 'لاہور' ✅  شہر = 'لاہور' ❌
  - parameter کا نام: def show(name) ✅  def دکھاؤ(نام) ❌
  - keyword: return ✅  واپس کریں ❌
  - keyword: for, if, while, import, class, print ✅ کبھی اردو نہیں ❌
  - list/dict keys: data['city'] ✅  data['شہر'] ❌ (as keys)
  - class کا نام: class Student ✅  class طالبعلم ❌
  - module/library نام: import numpy ✅ — کبھی مت بدلیں

صحیح Python کوڈ کی مثال:

# لاہور کے گھروں کا ڈیٹا بنائیں
house_data = [
    {'area': 5, 'price': 80},   # 5 مرلے کا گھر
    {'area': 10, 'price': 150}, # 10 مرلے کا گھر
    {'area': 15, 'price': 220}, # 15 مرلے کا گھر
]

# اوسط قیمت نکالیں
def calculate_average_price(houses):
    # تمام قیمتیں جمع کریں
    total = sum(house['price'] for house in houses)
    # اوسط نکالیں
    average = total / len(houses)
    return average

# نتیجہ دکھائیں
result = calculate_average_price(house_data)
print(f'لاہور میں گھر کی اوسط قیمت: {result} لاکھ روپے')

غلط Python کوڈ کی مثال — یہ کبھی مت لکھیں:

# یہ بالکل غلط ہے — Python چلے گی نہیں
def قیمت_نکالیں(گھروں_کی_فہرست):  ❌ function نام اردو میں
    کل = 0  ❌ variable نام اردو میں
    واپس کریں کل  ❌ return keyword اردو میں

کوڈ کے اضافی اصول:
- کم از کم 20 لائنیں لکھیں
- پاکستانی ڈیٹا استعمال کریں values میں:
  names: احمد، علی، فاطمہ، زینب، عمر
  cities: لاہور، کراچی، اسلام آباد، پشاور
  amounts: روپے میں
- ہر 2-3 لائنوں پر # اردو تبصرہ لازمی
- آخر میں output comment میں دکھائیں:
  # آؤٹ پٹ: لاہور میں گھر کی اوسط قیمت: 150.0 لاکھ روپے
- import statements ہمیشہ انگریزی میں
- ایک عام غلطی اور حل comment میں دکھائیں:
  # عام غلطی: اگر list خالی ہو تو ZeroDivisionError آئے گی
  # حل: پہلے check کریں if len(houses) > 0:
",

  "codeLanguage": "python",

  "commonMistakes": "3 عام غلطیاں جو ابتدائی طالب علم کرتے ہیں:
    ہر غلطی کا ڈھانچہ:
    غلطی: [کیا کرتے ہیں]
    مسئلہ: [کیوں غلط ہے]
    حل: [صحیح طریقہ]
    کم از کم 80 الفاظ",

  "comparison": "${context.subtopicTitleEn} کا سب سے ملتے
    جلتے concept سے موازنہ:
    - دونوں کے نام
    - 3 سے 4 فرق table format میں (text میں لکھیں)
    - کب کون سا استعمال کریں
    - ایک لائن میں یاد رکھنے کا طریقہ
    کم از کم 80 الفاظ",

  "applications": "5 عملی خیالات پاکستان میں:
    ہر خیال:
    عنوان: [منصوبے کا نام]
    کام: [کیا کرے گا]
    فری لانسنگ: [Upwork/Fiverr پر کیسے بیچیں]
    کم از کم 100 الفاظ",

  "quickSummary": "بالکل 5 bullet points:
    - ہر point ایک جملہ
    - سب سے اہم باتیں
    - طالب علم یہ پڑھ کر پورا concept یاد کر سکے",

  "quiz": [
    {
      "question": "اردو میں سوال — concept کی بنیادی سمجھ جانچے",
      "options": ["غلط جواب A", "صحیح جواب B", "غلط جواب C", "غلط جواب D"],
      "correctIndex": 1,
      "explanation": "کیوں یہ جواب صحیح ہے — 1 سے 2 جملے اردو میں"
    },
    {
      "question": "دوسرا سوال — عملی استعمال جانچے",
      "options": ["آپشن A", "آپشن B", "آپشن C", "آپشن D"],
      "correctIndex": 0,
      "explanation": "وضاحت اردو میں"
    },
    {
      "question": "تیسرا سوال — غلط فہمی دور کرے",
      "options": ["آپشن A", "آپشن B", "آپشن C", "آپشن D"],
      "correctIndex": 2,
      "explanation": "وضاحت اردو میں"
    }
  ],

  "metaTitle": "60 حروف سے کم — keyword پہلے — | سیکھیں AI",
  "metaDesc": "145-160 حروف — موضوع + فائدہ + ابھی مفت سیکھیں",
  "keywords": "10 اردو keywords کومہ سے الگ"
}
`;
}

export function buildSeoPrompt(context: {
  title: string;
  titleEn: string;
  content: string;
  slug: string;
  chapterTitle: string;
  courseTitle: string;
}): string {
  return `
آپ ایک SEO ماہر ہیں جو اردو ویب سائٹس کو Google پر rank
کراتے ہیں۔ آپ کو پاکستانی users کے لیے SEO لکھنی آتی ہے۔

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مواد کی تفصیل:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
صفحے کا عنوان: ${context.title}
انگریزی عنوان: ${context.titleEn}
کورس: ${context.courseTitle}
باب: ${context.chapterTitle}
صفحے کا مواد (خلاصہ): ${context.content.slice(0, 600)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO لکھنے کے اصول:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Meta Title اصول:
- سب سے اہم keyword بالکل شروع میں
- پھر | سیکھیں AI
- کل لمبائی: 50 سے 60 حروف کے درمیان
- مثال: "Linear Regression کیا ہے | سیکھیں AI"

Meta Description اصول:
- پہلے جملے میں main keyword
- بتائیں کہ طالب علم کیا سیکھے گا
- آخر میں action: "ابھی مفت سیکھیں"
- لمبائی: 145 سے 160 حروف کے درمیان
- مثال: "Linear Regression اردو میں سیکھیں۔ Python کوڈ،
  پاکستانی مثالیں، اور ریاضی کی آسان وضاحت۔ ابھی مفت سیکھیں۔"

Keywords اصول:
- پہلے 3: exact match (بالکل وہی جو لوگ search کرتے ہیں)
- اگلے 4: long-tail (4-5 الفاظ کے phrases)
- آخری 3: related terms
- سب اردو میں یا اردو+انگریزی ملا کر
- مثال: "linear regression اردو, linear regression کیا ہے,
  مشین لرننگ اردو میں, linear regression python tutorial اردو,
  اردو میں AI سیکھیں"

FAQ اصول:
- وہ سوالات جو پاکستانی طالب علم واقعی پوچھتے ہیں
- سوال قدرتی اردو میں — جیسے WhatsApp پر پوچھا ہو
- جواب مختصر اور واضح — 2-3 جملے
- مثال سوال: "${context.titleEn} سیکھنے میں کتنا وقت لگتا ہے؟"
- مثال جواب: "اگر آپ روزانہ 1 گھنٹہ دیں تو 1 ہفتے میں
  بنیادی ${context.titleEn} سیکھ سکتے ہیں۔ عملی مشق کے
  ساتھ آپ 2 ہفتے میں خود projects بنا سکتے ہیں۔"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
صرف یہ JSON واپس کریں — کچھ اور نہیں:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "metaTitle": "50-60 حروف — keyword پہلے — | سیکھیں AI آخر میں",

  "metaDesc": "145-160 حروف — keyword + فائدہ + ابھی مفت سیکھیں",

  "keywords": "10 keywords کومہ سے الگ — exact + long-tail + related",

  "ogTitle": "Social media کے لیے — دلچسپ اور مختصر — 60 حروف سے کم — emoji ایک",

  "ogDesc": "Social sharing کے لیے — 100 حروف سے کم — کیوں پڑھیں؟",

  "faqQuestions": [
    {
      "question": "قدرتی اردو سوال جو طالب علم پوچھتا ہے",
      "answer": "واضح اور مختصر جواب — 2-3 جملے — آسان اردو"
    },
    {
      "question": "دوسرا عام سوال",
      "answer": "دوسرا جواب"
    },
    {
      "question": "تیسرا عام سوال",
      "answer": "تیسرا جواب"
    },
    {
      "question": "چوتھا عام سوال",
      "answer": "چوتھا جواب"
    },
    {
      "question": "پانچواں عام سوال",
      "answer": "پانچواں جواب"
    }
  ]
}
`;
}

export function buildSocialPrompt(context: {
  title: string;
  titleEn: string;
  summary: string;
  url: string;
  courseTitle: string;
}): string {
  return `
آپ ایک سوشل میڈیا ماہر ہیں جو پاکستانی نوجوانوں کے لیے
تعلیمی مواد promote کرتے ہیں۔ آپ جانتے ہیں کہ پاکستانی
social media پر کیا چیز viral ہوتی ہے۔

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مواد کی تفصیل:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
موضوع: ${context.title} (${context.titleEn})
کورس: ${context.courseTitle}
خلاصہ: ${context.summary.slice(0, 300)}
لنک: ${context.url}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ہر platform کے اصول:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FACEBOOK (پاکستانی audience زیادہ):
- شروع hook سے کریں — پہلا جملہ ایسا جو رکنے پر مجبور کرے
- مثال hook: "کیا آپ جانتے ہیں کہ پاکستان میں ہر مہینے
  5000+ لوگ ${context.titleEn} سیکھ کر jobs لے رہے ہیں؟"
- پھر 3-4 جملے موضوع کے بارے میں آسان اردو میں
- پھر 3 bullet points (✅ سے) جو سیکھیں گے
- آخر میں لنک اور call to action
- 5-8 hashtags اردو اور انگریزی ملا کر
- کل: 150-200 الفاظ
- Emojis: 5-8 مناسب جگہوں پر

INSTAGRAM (نوجوان audience):
- پہلی 2 لائنیں سب سے اہم — یہی preview میں دکھتی ہیں
- Bold statement سے شروع کریں
- مثال: "🚀 اردو میں ${context.titleEn} سیکھنا اب آسان ہے!"
- مختصر اور energetic لکھیں
- 3 نکات جو سیکھیں گے (🔥 سے)
- لنک bio میں mention کریں
- 20-25 hashtags — اردو+انگریزی+AI related
- کل: 100-150 الفاظ
- Emojis: زیادہ — ہر نکتے پر

TWITTER/X (مختصر اور تیز):
- ایک زبردست جملہ جو retweet ہو
- مثال: "${context.titleEn} سیکھنا چاہتے ہو؟ 🤖
  اردو میں مفت — code + math + مثالیں سب شامل 👇"
- لنک ضرور شامل
- 2-3 hashtags صرف
- کل: 200-250 حروف (Twitter limit یاد رکھیں)

YOUTUBE DESCRIPTION (SEO کے لیے اہم):
- پہلے 2 جملے most important — YouTube search میں یہی دکھتا ہے
- پھر موضوع کیا cover ہوگا — numbered list
- پھر channel کے بارے میں 2 جملے
- Keywords naturally شامل کریں
- لنک شامل کریں
- کل: 200-300 الفاظ

LINKEDIN (professional tone):
- Professional opening — career opportunity mention کریں
- مثال: "AI industry میں ${context.titleEn} کی مانگ
  2024 میں 300% بڑھی ہے۔"
- Skills کی بات کریں
- Pakistani market opportunity mention کریں
- Professional hashtags
- کل: 150-200 الفاظ
- Emojis: کم — صرف 3-4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
صرف یہ JSON واپس کریں — کچھ اور نہیں:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "facebook": "مکمل Facebook پوسٹ — hook + موضوع + bullets + لنک + hashtags — 150-200 الفاظ",

  "instagram": "مکمل Instagram caption — bold start + نکات + bio link mention + 20-25 hashtags — 100-150 الفاظ",

  "twitter": "مکمل Tweet — ایک زبردست جملہ + لنک + 2-3 hashtags — 250 حروف سے کم",

  "youtube": "مکمل YouTube description — SEO optimized — numbered list + channel info + لنک — 200-300 الفاظ",

  "linkedin": "مکمل LinkedIn پوسٹ — professional tone + career opportunity + Pakistani market + hashtags — 150-200 الفاظ"
}
`;
}
