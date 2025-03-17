"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, ArrowUpRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Virtuoso } from "react-virtuoso";

// Add Review type definition
interface Review {
  id: number;
  title: string;
  description: string;
  rate: number;
  created_at: string;
  review_status: string;
  company: {
    id: number;
    name: string;
    slug?: string;
  };
}

// Extracted ReviewCard component for better code organization and performance
function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="mx-auto my-3 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/unknown.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {review.company.name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Link
                href={`/company/${review.company.slug ?? review.company.id}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {review.company.name}
              </Link>
              <Badge
                variant={
                  review.review_status === "NOT_WORKING"
                    ? "secondary"
                    : "default"
                }
              >
                {review.review_status === "NOT_WORKING"
                  ? "تجربه کاری"
                  : "مصاحبه"}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={review.created_at}>
                {formatDate(review.created_at)}
              </time>
            </div>
          </div>
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
      </CardHeader>

      <CardContent className="space-y-4 overflow-hidden">
        <h3 className="text-lg font-semibold truncate">{review.title}</h3>

        <div
          className="prose prose-sm dark:prose-invert max-w-none line-clamp-3 overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: review.description,
          }}
        />

        <Link
          href={`/review/${review.id}`}
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <span>ادامه مطلب</span>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0" />
        </Link>
      </CardContent>
    </Card>
  );
}

// LoadingIndicator component
function LoadingIndicator() {
  return (
    <div className="text-center py-4">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
    </div>
  );
}

export default function FeedClient({
  initialReviews,
  reviewIndex,
}: {
  initialReviews: Review[];
  reviewIndex: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  // Load more reviews when scrolling
  const loadMore = useCallback(async () => {
    if (isLoading || endReached) return;

    try {
      setIsLoading(true);

      // Get the last loaded review's index
      const lastReviewId = reviews[reviews.length - 1]?.id;
      const startIndex = lastReviewId
        ? reviewIndex.findIndex((r) => r.id === lastReviewId) + 1
        : reviews.length;

      // We've reached the end if the next batch is beyond available reviews
      if (startIndex >= reviewIndex.length) {
        setEndReached(true);
        return;
      }

      // Get the next batch of reviews from the index
      const nextBatch = reviewIndex
        .slice(startIndex, startIndex + 10)
        .map((review) => ({
          ...review,
          // Only load essential data initially
          description:
            review.description.substring(0, 300) +
            (review.description.length > 300 ? "..." : ""),
        }));

      // Add the new reviews to the state
      setReviews((prev) => [...prev, ...nextBatch]);
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, endReached, reviews, reviewIndex]);

  return (
    <div className="max-w-2xl mx-auto">
      <Virtuoso
        style={{ height: "calc(100vh - 100px)" }}
        data={reviews}
        endReached={loadMore}
        overscan={500}
        itemContent={(index, review) => <ReviewCard review={review} />}
        components={{
          Footer: () =>
            isLoading ? (
              <LoadingIndicator />
            ) : endReached ? (
              <div className="text-center py-4 text-muted-foreground">
                پایان نتایج
              </div>
            ) : null,
        }}
      />
    </div>
  );
}
