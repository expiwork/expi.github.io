"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Info } from "lucide-react";
import { toPersianNumbers } from "@/lib/utils";

const MIN_EIDI_1404 = 143323680; // ریال - معادل 14,332,368 تومان
const MAX_EIDI_1404 = 214985520; // ریال - معادل 21,498,552 تومان
const TAX_EXEMPTION_1404 = 200000000; // 20 میلیون تومان معافیت (به ریال)
const FIRST_TAX_BRACKET_RATE = 0.1; // نرخ مالیات 10٪

interface EidiDetails {
  baseAmount: number;
  taxableAmount: number;
  taxAmount: number;
  finalAmount: number;
}

export function EidiCalculator() {
  const [salary, setSalary] = useState<string>("");
  const [monthsWorked, setMonthsWorked] = useState<string>("12");
  const [employmentType, setEmploymentType] = useState<"full" | "part">("full");
  const [result, setResult] = useState<number | null>(null);
  const [details, setDetails] = useState<EidiDetails | null>(null);

  const calculateEidi = () => {
    // تبدیل اعداد فارسی به انگلیسی و حذف کاما
    const baseSalary = parseInt(
      salary
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
        .replace(/,/g, "")
    );
    const months = parseInt(monthsWorked);

    if (!baseSalary || !months) return;

    // تبدیل حقوق از تومان به ریال
    const baseSalaryRial = baseSalary * 10;

    let eidi: number;

    if (employmentType === "full") {
      // محاسبه عیدی بین ۲ تا ۳ برابر حقوق پایه
      eidi = Math.min(
        baseSalaryRial * 3,
        Math.max(baseSalaryRial * 2, MIN_EIDI_1404)
      );

      // اعمال سقف عیدی
      eidi = Math.min(eidi, MAX_EIDI_1404);

      // محاسبه نسبت ماه‌های کارکرد
      if (months < 12) {
        eidi = (eidi * months) / 12;
      }
    } else {
      // برای کارمندان پاره وقت
      eidi = (baseSalaryRial * 2 * months) / 12;
    }

    const baseEidi = eidi;
    const taxableAmount = Math.max(0, baseEidi - TAX_EXEMPTION_1404);
    const taxAmount = taxableAmount * FIRST_TAX_BRACKET_RATE;
    const finalAmount = baseEidi - taxAmount;

    setResult(Math.round(finalAmount));
    setDetails({
      baseAmount: Math.round(baseEidi),
      taxableAmount: Math.round(taxableAmount),
      taxAmount: Math.round(taxAmount),
      finalAmount: Math.round(finalAmount),
    });
  };

  const formatNumber = (value: string) => {
    // First convert to English numbers and remove non-digits
    const englishNumber = value
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
      .replace(/\D/g, "");
    // Add thousand separators and convert to Persian numbers
    return toPersianNumbers(
      englishNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateEidi();
  };

  return (
    <>
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm leading-6">
        <p>
          این ماشین‌حساب بر اساس آخرین اطلاعیه‌های وزارت کار و رفاه اجتماعی
          طراحی شده است. از آنجایی که هر شرکت ممکن است روش محاسباتی متفاوتی
          داشته باشد، توصیه می‌کنیم در صورت مشاهده هرگونه مغایرت، جزئیات محاسبه
          عیدی خود را از واحد منابع انسانی شرکت پیگیری نمایید.
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Info className="h-6 w-6 text-primary" />
            محاسبه رایگان عیدی سال ۱۴۰۴
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-base font-medium text-foreground/90">
                حقوق پایه ماهانه (تومان)
              </Label>
              <Input
                type="text"
                value={salary}
                onChange={(e) => setSalary(formatNumber(e.target.value))}
                placeholder="مثال: ۸,۰۰۰,۰۰۰"
                className="text-left ltr text-lg h-12 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-foreground/90">
                نوع همکاری
              </Label>
              <Select
                value={employmentType}
                onValueChange={(value: "full" | "part") =>
                  setEmploymentType(value)
                }
              >
                <SelectTrigger className="h-12 text-base transition-colors focus:ring-2 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full" className="text-base py-3">
                    تمام وقت
                  </SelectItem>
                  <SelectItem value="part" className="text-base py-3">
                    پاره وقت
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-foreground/90">
                مدت همکاری در سال ۱۴۰۳ (ماه)
              </Label>
              <Select value={monthsWorked} onValueChange={setMonthsWorked}>
                <SelectTrigger className="h-12 text-base transition-colors focus:ring-2 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem
                      key={i + 1}
                      value={(i + 1).toString()}
                      className="text-base py-3"
                    >
                      {toPersianNumbers(i + 1)} ماه
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              محاسبه عیدی
            </Button>
          </form>

          {details !== null && (
            <div className="mt-8 space-y-6">
              <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-foreground/90">
                  نتیجه محاسبه:
                </h3>
                <div className="space-y-3">
                  <p className="flex justify-between items-center text-base">
                    <span>مبلغ عیدی پایه:</span>
                    <span className="ltr font-medium">
                      {toPersianNumbers(
                        Math.round(details.baseAmount / 10).toLocaleString(
                          "fa-IR"
                        )
                      )}{" "}
                      تومان
                    </span>
                  </p>
                  <p className="flex justify-between items-center text-base">
                    <span>مبلغ مشمول مالیات:</span>
                    <span className="ltr font-medium">
                      {toPersianNumbers(
                        Math.round(details.taxableAmount / 10).toLocaleString(
                          "fa-IR"
                        )
                      )}{" "}
                      تومان
                    </span>
                  </p>
                  <p className="flex justify-between items-center text-base">
                    <span>مالیات (۱۰٪):</span>
                    <span className="ltr font-medium text-red-500">
                      {toPersianNumbers(
                        Math.round(details.taxAmount / 10).toLocaleString(
                          "fa-IR"
                        )
                      )}{" "}
                      تومان
                    </span>
                  </p>
                  <div className="border-t pt-3 mt-3">
                    <p className="flex justify-between items-center text-lg font-bold">
                      <span>عیدی خالص:</span>
                      <span className="ltr text-primary">
                        {toPersianNumbers(
                          Math.round(details.finalAmount / 10).toLocaleString(
                            "fa-IR"
                          )
                        )}{" "}
                        تومان
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm space-y-3 p-4 bg-muted/50 rounded-lg border">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
                  سقف معافیت مالیاتی عیدی: {toPersianNumbers("20,000,000")}{" "}
                  تومان
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
                  نرخ مالیات برای مازاد معافیت: ۱۰٪
                </p>
              </div>
            </div>
          )}

          <div className="text-sm space-y-3 mt-8 p-4 bg-muted/50 rounded-lg border">
            <p className="flex items-center gap-2 text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
              حداقل عیدی سال ۱۴۰۴: {toPersianNumbers("14,332,368")} تومان
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
              حداکثر عیدی سال ۱۴۰۴: {toPersianNumbers("21,498,552")} تومان
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
