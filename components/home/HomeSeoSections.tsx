import Link from "next/link";
import { HelpCircle } from "lucide-react";
import AnimateOnScroll from "@/components/home/AnimateOnScroll";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/seo/site";

const faqs = [
  {
    question: "سیکھیں AI کیا ہے؟",
    answer:
      "سیکھیں AI پاکستان کا پہلا مکمل مصنوعی ذہانت (Artificial Intelligence) کا کورس ہے جو مکمل طور پر اردو زبان میں تیار کیا گیا ہے۔ یہاں آپ Python، مشین لرننگ، اور AI کے بنیادی تصورات مفت سیکھ سکتے ہیں۔",
  },
  {
    question: "کیا یہ کورس واقعی مفت ہے؟",
    answer:
      "جی ہاں، سیکھیں AI پر تمام تعلیمی مواد بالکل مفت ہے۔ کوئی پوشیدہ فیس، سبسکرپشن، یا کریڈٹ کارڈ درکار نہیں۔",
  },
  {
    question: "اردو میں AI کیوں سیکھیں؟",
    answer:
      "زیادہ تر AI کورسز انگریزی میں ہیں۔ سیکھیں AI اردو میں سمجھاتا ہے تاکہ طالب علم، پیشہ ور، اور نوجوان بغیر زبان کی رکاوٹ کے AI سیکھ سکیں۔",
  },
  {
    question: "کیا مجھے پروگرامنگ کا تجربہ چاہیے؟",
    answer:
      "نہیں۔ کورس ابتدائی سطح سے شروع ہوتا ہے۔ Python کی بنیادی مثالیں اردو تبصروں کے ساتھ دی جاتی ہیں۔",
  },
  {
    question: "مصنوعی ذہانت (AI) اردو میں کیسے سیکھیں؟",
    answer:
      "ہمارے کورسز میں ابواب، موضوعات، اور ذیلی موضوعات ترتیب وار ہیں۔ ہر سبق میں تعریف، عملی مثال، Python کوڈ، اور حقیقی دنیا کے استعمال شامل ہیں۔",
  },
];

export default function HomeSeoSections() {
  const siteUrl = getSiteUrl();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "سیکھیں AI",
    url: siteUrl,
    description:
      "اردو میں مصنوعی ذہانت، مشین لرننگ، اور Python سیکھنے کا مفت آن لائن پلیٹ فارم",
    inLanguage: "ur",
    areaServed: "PK",
  };

  return (
    <>
      <JsonLd data={[faqSchema, orgSchema]} />

      {/* SEO-rich intro — visible content for Google */}
      <section
        className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900"
        aria-labelledby="about-ai-urdu"
      >
        <div className="container-public">
          <AnimateOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="about-ai-urdu" className="section-title-urdu">
                اردو میں مصنوعی ذہانت سیکھیں — پاکستان کے لیے
              </h2>
              <p className="body-urdu-comfort mt-6">
                <strong>مصنوعی ذہانت (Artificial Intelligence)</strong> آج کی
                دنیا کی سب سے اہم ٹیکنالوجی ہے۔ سیکھیں AI نے یہ مشن اختیار کیا
                ہے کہ ہر پاکستانی — چاہے وہ طالب علم ہو، ٹیچر، یا کاروباری شخص
                — اردو میں AI سیکھ سکے۔
              </p>
              <p className="body-urdu-comfort mt-4">
                ہمارے کورس میں <strong>مشین لرننگ</strong>،{" "}
                <strong>ڈیپ لرننگ</strong>، <strong>Python پروگرامنگ</strong>،
                اور <strong>ڈیٹا سائنس</strong> کے موضوعات آسان اردو میں،
                حقیقی پاکستانی مثالوں اور عملی کوڈ کے ساتھ پیش کیے جاتے ہیں۔
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ for SEO + users */}
      <section
        id="faq"
        className="scroll-mt-24 bg-slate-50 py-20 dark:bg-slate-950"
        aria-labelledby="faq-heading"
      >
        <div className="container-public">
          <AnimateOnScroll>
            <div className="mb-10 flex items-center justify-center gap-3">
              <HelpCircle className="h-8 w-8 text-blue-600" aria-hidden />
              <h2 id="faq-heading" className="section-title-urdu">
                اکثر پوچھے گئے سوالات
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <AnimateOnScroll key={faq.question} delay={index * 60}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-lg font-bold leading-[1.75] text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="body-urdu-comfort mt-3 text-base">
                    {faq.answer}
                  </p>
                </article>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-10 text-center">
            <p className="body-urdu-comfort">
              مزید سوالات؟{" "}
              <Link
                href="/about"
                className="font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
              >
                ہم سے رابطہ کریں
              </Link>
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
