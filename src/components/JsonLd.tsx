import { Company } from "@/app/types/index";

interface CompanyJsonLdProps {
  company: Company;
}

export function CompanyJsonLd({ company }: CompanyJsonLdProps) {
  // Only include reviews if there are actual reviews
  const hasReviews = company.reviews && company.reviews.length > 0;
  const reviewCount = hasReviews ? company.reviews.length : undefined;

  // Ensure rating is within valid range (0-5)
  const rating =
    company.rate && company.rate > 0 && company.rate <= 5
      ? company.rate
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    ...(hasReviews &&
      rating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount: reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
