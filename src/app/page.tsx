import { HomeClient } from "@/components/HomeClient";
import { getMinimizedCompanies } from "@/utils/serverDataUtils";

export const dynamic = "force-static";

async function getHomeData() {
  try {
    const minimizedCompanies = await getMinimizedCompanies();

    const totalReviews = minimizedCompanies.reduce(
      (sum, company) => sum + (company.total_review || 0),
      0
    );

    return {
      companyCount: totalReviews,
      featuredCompanies: minimizedCompanies.slice(0, 10).map((company) => ({
        id: company.id,
        name: company.name,
        rate: company.rate,
        total_review: company.total_review || 0,
        image: company.image || null,
        slug: company.slug,
      })),
      allCompanies: minimizedCompanies,
    };
  } catch (error) {
    console.error("Error loading home data:", error);
    return {
      companyCount: 0,
      featuredCompanies: [],
      allCompanies: [],
    };
  }
}

export default async function HomePage() {
  const homeData = await getHomeData();
  return <HomeClient data={homeData} />;
}
