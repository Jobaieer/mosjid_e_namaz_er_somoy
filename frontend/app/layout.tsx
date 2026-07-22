import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosjid E Namaz-er Somoy | মসজিদে নামাজের সময়",
  description:
    "আপনার নিকটবর্তী মসজিদের সঠিক নামাজের সময়সূচি দেখুন। ফজর, জোহর, আসর, মাগরিব, ইশা এবং জুমার সময়সহ সূর্যোদয় ও সূর্যাস্তের সময়। বাংলাদেশের সকল মসজিদের জন্য সবচেয়ে নির্ভুল নামাজের টাইমটেবিল।",
  keywords: [
    "নামাজের সময়",
    "মসজিদের সময়সূচি",
    "আজকের নামাজের সময়",
    "প্রার্থনার সময়",
    "fajr",
    "zuhr",
    "asr",
    "maghrib",
    "isha",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
