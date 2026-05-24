import {
  BarChart3,
  Brain,
  Code2,
  Globe,
  type LucideIcon,
} from "lucide-react";

const previews: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}[] = [
  {
    icon: Brain,
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "تعریف اور وضاحت",
    desc: "آسان اردو میں مکمل وضاحت",
  },
  {
    icon: BarChart3,
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "ریاضی اور فارمولے",
    desc: "قدم بہ قدم حساب",
  },
  {
    icon: Globe,
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "حقیقی مثالیں",
    desc: "پاکستان سے متعلق مثالیں",
  },
  {
    icon: Code2,
    iconBg: "bg-violet-100 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Python کوڈ",
    desc: "عملی کوڈ مثالیں",
  },
];

export default function TopicContentPreview() {
  return (
    <div className="mt-10">
      <p className="font-sans text-small font-medium text-blue-600 dark:text-blue-400">
        ہر سبق میں
      </p>
      <h2 className="section-title-urdu mt-2 text-xl lg:text-2xl">
        اس موضوع میں کیا سیکھیں گے؟
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {previews.map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/80 dark:bg-card"
          >
            <div
              className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden />
            </div>
            <p className="font-bold leading-[1.75] text-slate-900 dark:text-text-primary">
              {title}
            </p>
            <p className="mt-1.5 text-small leading-relaxed text-slate-500 dark:text-text-muted">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
