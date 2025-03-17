import { Review } from "@/app/types";
import { getAllCompanies } from "./companies";

export async function getReviewById(
  id: string | number
): Promise<Review | null> {
  const companies = await getAllCompanies();

  for (const company of companies) {
    const review = company.reviews.find((r) => r.id === id);
    if (review) {
      return {
        ...review,
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
        },
      };
    }
  }
  return null;
}

export async function getAllReviewIds(): Promise<string[]> {
  const reviewIds: string[] = [];
  const companies = await getAllCompanies();

  for (const company of companies) {
    if (company.reviews && Array.isArray(company.reviews)) {
      for (const review of company.reviews) {
        reviewIds.push(review.id.toString());
      }
    }
  }
  return reviewIds;
}
