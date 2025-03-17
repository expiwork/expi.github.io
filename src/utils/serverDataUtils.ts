import fs from "fs/promises";
import path from "path";

// Cache for data to avoid repeated file reads
let companiesCache: any[] | null = null;

// Server-side only function to get all companies
export async function getServerCompanies() {
  if (companiesCache?.length) return companiesCache;

  try {
    const dataPath = path.join(process.cwd(), "cached-companies.json");
    const fileContents = await fs.readFile(dataPath, "utf8");
    companiesCache = JSON.parse(fileContents);
    return companiesCache;
  } catch (error) {
    console.error("Error loading companies data:", error);
    return [];
  }
}

export async function getServerCompanyBySlug(slug: string) {
  const companies = await getServerCompanies();
  return companies.find(
    (company) => String(company.slug) === slug || String(company.id) === slug
  );
}

export async function getMinimizedCompanies() {
  const companies = await getServerCompanies();

  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    description: company.description || "",
    rate: company.rate,
    image: company.image,
    total_review: company.reviews?.length || 0,
    salary_min: company.salary_min || 0,
    salary_max: company.salary_max || 0,
    created_at: company.created_at,
    verified: company.verified,
  }));
}

export async function getServerReviews() {
  try {
    const companies = await getServerCompanies();

    return companies?.map((x) => x.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getServerReviewById(id: number) {
  const companies = await getServerCompanies();
  return companies
    ?.map((x) => x.reviews)
    .flat()
    .find((x) => x.id === id);
}
