import { Metadata } from "next";

export const metadata: Metadata = {
  title: "وبلاگ اکسپی | مقالات و راهنمای‌های مرتبط با کار و استخدام",
  description:
    "مجموعه مقالات و راهنماهای کاربردی درباره کار، استخدام، مصاحبه شغلی و تجربه کاری در شرکت‌های ایرانی",
  keywords: [
    "وبلاگ اکسپی",
    "مقالات کاری",
    "راهنمای استخدام",
    "مصاحبه شغلی",
    "اکسپی",
    "مصاحبه شغلی",
    "تجربه کاری",
    "اکسپی",
  ],
  openGraph: {
    title: "وبلاگ اکسپی",
    description: "مقالات و راهنمای‌های مرتبط با کار و استخدام",
    type: "website",
    locale: "fa_IR",
    siteName: "اکسپی",
  },
  alternates: {
    canonical: "https://expi.work/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-12">{children}</div>
    </div>
  );
}
