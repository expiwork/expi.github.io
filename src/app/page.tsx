import { HomeClient } from "@/components/HomeClient";
import { getMinimizedCompanies } from "@/utils/serverDataUtils";

export const dynamic = "force-static";

// This function runs at build time only
async function getHomeData() {
  try {
    // Use the server function instead of reading directly
    const minimizedCompanies = await getMinimizedCompanies();

    return {
      companyCount: minimizedCompanies.length,
      featuredCompanies: minimizedCompanies.slice(0, 10).map((company) => ({
        id: company.id,
        name: company.name,
        rate: company.rate,
        total_review: company.total_review || 0,
        image: company.image || null,
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
