import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PublicThemeProvider from "@/components/providers/PublicThemeProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicThemeProvider>
      <Header />
      <main className="min-h-[calc(100vh-var(--header-height))] pt-[var(--header-height)]">
        <div className="container-public">{children}</div>
      </main>
      <Footer />
    </PublicThemeProvider>
  );
}
