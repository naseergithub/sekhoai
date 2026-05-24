import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

type RelatedItem = {
  title: string;
  slug: string;
};

export default function RelatedSubtopics({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-10">
      <SectionHeading title="متعلقہ موضوعات" className="mb-6" />
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.slug} hoverable className="flex flex-col">
            <h3 className="mb-3 flex-1 text-body font-semibold text-text-primary">
              {item.title}
            </h3>
            <Button href={`/subtopic/${item.slug}`} size="sm">
              پڑھیں
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
