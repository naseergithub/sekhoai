import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "سیکھیں AI - اردو میں مصنوعی ذہانت سیکھیں",
  description:
    "اردو زبان میں مصنوعی ذہانت کا مکمل کورس - بنیادی سے اعلی درجے تک",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ur"
      dir="rtl"
      className={`${notoNastaliqUrdu.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${notoNastaliqUrdu.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
