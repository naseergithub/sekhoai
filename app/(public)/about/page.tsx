import Breadcrumb from "@/components/course/Breadcrumb";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "ہم سے رابطہ - سیکھیں AI",
  description: "سیکھیں AI کے بارے میں جانیں — اردو میں مصنوعی ذہانت سیکھنے کا پلیٹ فارم",
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <Breadcrumb
        items={[
          { label: "گھر", href: "/" },
          { label: "ہم سے رابطہ", href: "/about" },
        ]}
      />
      <SectionHeading title="ہم سے رابطہ" className="mb-8" />
      <Card className="max-w-2xl">
        <div className="space-y-4 text-urdu-body text-text-body">
          <p>
            سیکھیں AI پاکستان کا پہلا مکمل مصنوعی ذہانت کا کورس ہے جو مکمل طور
            پر اردو زبان میں تیار کیا گیا ہے۔
          </p>
          <p>
            ہمارا مقصد ہر پاکستانی کو AI سیکھنے کا موقع دینا ہے — چاہے آپ طالب
            علم ہوں، پیشہ ور ہوں، یا صرف تجسس رکھتے ہوں۔
          </p>
          <p>سوالات یا تعاون کے لیے ہم سے رابطہ کریں۔</p>
        </div>
      </Card>
    </div>
  );
}
