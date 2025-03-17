import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Briefcase, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Metadata } from "next";
import { formatDate, toPersianNumbers } from "@/lib/utils";
import {
  getServerReviewById,
  getServerCompanies,
} from "@/utils/serverDataUtils";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const param = await params.id;
  const review = await getServerReviewById(Number(param));

  if (!review) return {};

  return {
    title: `تجربه کاری ${review.job_title ? `${review.job_title} ` : ""}در ${
      review.company.name
    } | ${review.title}`,
    description: `${
      review.job_title ? `${review.job_title} - ` : ""
    }${review.description.substring(0, 160)} - ${review.company.name}`,
    openGraph: {
      title: review.title,
      description: review.description.substring(0, 160),
      type: "article",
      publishedTime: review.created_at,
    },
    alternates: {
      canonical: `https://expi.work/review/${param}`,
    },
  };
}

// تولید مسیرهای استاتیک برای تمام نظرات
export async function generateStaticParams() {
  try {
    const companies = await getServerCompanies();
    const allReviewIds = [];

    // استخراج تمام شناسه‌های نظرات از تمام شرکت‌ها
    for (const company of companies) {
      if (company.reviews && Array.isArray(company.reviews)) {
        for (const review of company.reviews) {
          if (review && review.id) {
            allReviewIds.push({ id: String(review.id) });
          }
        }
      }
    }

    console.log(`Generated static paths for ${allReviewIds.length} reviews`);
    return allReviewIds;
  } catch (error) {
    console.error("Error generating static params for reviews:", error);
    return [];
  }
}

export default async function ReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params.id;
  const review = await getServerReviewById(Number(param));

  if (!review) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        {/* <ArchiveNotice /> */}
        <Link
          href={`/company/${review.company.slug ?? review.company.id}`}
          className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>بازگشت به صفحه شرکت</span>
        </Link>

        <Card className="max-w-3xl mx-auto overflow-hidden">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 min-w-0">
                <CardTitle className="text-2xl truncate">
                  {review.title}
                </CardTitle>
                <Link
                  href={`/company/${review.company.slug ?? review.company.id}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{review.company.name}</span>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {review.company.description}
                </p>
              </div>
              <Badge
                variant={
                  review.review_status === "NOT_WORKING"
                    ? "secondary"
                    : "default"
                }
                className="shrink-0"
              >
                {review.review_status === "NOT_WORKING"
                  ? "تجربه کاری"
                  : "مصاحبه"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={review.created_at}>
                  {formatDate(review.created_at)}
                </time>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < review.rate
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 overflow-hidden">
            {review.job_title && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>موقعیت شغلی: {review.job_title}</span>
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: review.description,
                }}
              />
            </div>

            {review.salary && review.salary > 0 && (
              <div className="flex items-center gap-2 text-sm bg-muted/50 p-4 rounded-lg">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>
                  حقوق:{" "}
                  {toPersianNumbers(review.salary)
                    .split("")
                    .reverse()
                    .reduce((acc, digit, i) => {
                      if (i > 0 && i % 3 === 0) {
                        return digit + "," + acc;
                      }
                      return digit + acc;
                    }, "")}{" "}
                  تومان
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
