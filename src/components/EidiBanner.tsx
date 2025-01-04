"use client";

import { Calculator, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function EidiBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b flex justify-center">
      <div className="container relative flex justify-center items-center">
        <div className="px-3 py-3 w-full">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 flex-shrink-0">
              <span className="flex p-2">
                <Calculator
                  className="h-6 w-6 text-primary"
                  aria-hidden="true"
                />
              </span>
              <div className="mr-3 font-medium truncate">
                <span className="md:hidden">محاسبه آنلاین عیدی سال ۱۴۰۴</span>
                <span className="hidden md:inline">
                  محاسبه دقیق و رایگان عیدی پایان سال ۱۴۰۴ کارگران و کارمندان
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 order-3 sm:order-2 sm:mt-0">
              <Link href="/calculator/eidi">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                  محاسبه کنید
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
