import { Suspense } from "react";
import FeedClient from "@/components/FeedClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCompanies } from "@/data/companies";

export const metadata = {
  title: "فید تجربیات | اکسپی",
  description: "آخرین تجربیات کاری و مصاحبه‌های شغلی در شرکت‌های ایرانی",
};

// Set this to true for static generation
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export default async function FeedPage() {
  // Get all companies
  const companies = await getAllCompanies();

  // Create a review index with minimal data for lazy loading
  const allReviewsMeta = [];

  companies.forEach((company) => {
    if (!company.reviews) return;

    company.reviews.forEach((review) => {
      allReviewsMeta.push({
        id: review.id,
        title: review.title,
        rate: review.rate,
        created_at: review.created_at,
        review_status: review.review_status,
        description: review.description,
        // Only include essential company info to reduce payload size
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
        },
      });
    });
  });

  // Sort the review index by date (newest first)
  const sortedReviewsMeta = allReviewsMeta.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get just the first 10 reviews for initial display
  const initialReviews = sortedReviewsMeta.slice(0, 10);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <FeedSkeleton key={i} />
              ))}
            </div>
          }
        >
          <FeedClient
            initialReviews={initialReviews}
            reviewIndex={sortedReviewsMeta}
          />
        </Suspense>
      </div>
    </main>
  );
}

function FeedSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
