import { Company } from "./types";

export const defaultMetadata = {
  title: "اکسپی | تجربه کاری و مصاحبه شغلی قبل از استخدام",
  description:
    "مرجع جامع تجربیات کاری، مصاحبه‌های شغلی و نظرات کارمندان درباره شرکت‌های ایرانی",
  keywords:
    "تجربه کاری، مصاحبه شغلی، شرکت‌های ایرانی، حقوق و دستمزد، فرصت‌های شغلی",
};

export const generateCompanyMetadata = (company: Company) => ({
  title: `${company.name} | نظرات و تجربیات کارمندان | اکسپی`,
  description: `تجربیات کاری، مصاحبه‌های شغلی و نظرات کارمندان درباره ${company.name}. میانگین حقوق، امتیاز ${company.rate} از ۵، و ${company.total_review} نظر ثبت شده.`,
  keywords: `${company.name}, تجربه کار در ${company.name}, مصاحبه ${company.name}, حقوق ${company.name}`,
});
