import { EidiCalculator } from "@/components/calculator/EidiCalculator";

export const metadata = {
  title: "محاسبه آنلاین عیدی 1404 | ماشین حساب عیدی کارگران و کارمندان",
  description:
    "محاسبه دقیق عیدی سال 1404 کارگران، کارمندان و بازنشستگان بر اساس آخرین قوانین کار. محاسبه آنلاین و رایگان عیدی پایان سال با حداقل و حداکثر مصوب.",
  keywords:
    "محاسبه عیدی 1404, عیدی کارگران 1404, محاسبه عیدی کارمندان, ماشین حساب عیدی, عیدی پایان سال 1404",
  openGraph: {
    title: "محاسبه آنلاین عیدی 1404 کارگران و کارمندان",
    description:
      "محاسبه دقیق و آنلاین عیدی سال 1404 بر اساس آخرین قوانین و مقررات کار",
  },
};

export default function EidiCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          محاسبه عیدی سال ۱۴۰۴
        </h1>
        <EidiCalculator />
      </div>
    </div>
  );
}
