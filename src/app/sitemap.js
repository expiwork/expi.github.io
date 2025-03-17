import fs from "fs";
import path from "path";
import { getServerCompanies, getServerReviews } from "@/utils/serverDataUtils";

export const dynamic = "force-static";

function generateSitemapXML(urls, type) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (url) => `
        <url>
          <loc>${url.url}</loc>
          <lastmod>${url.lastModified}</lastmod>
          <changefreq>${url.changeFrequency}</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `
        )
        .join("")}
    </urlset>`;
}

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://expi.work";
  const lastModified = new Date().toISOString();

  // Static pages
  const staticUrls = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Generate static sitemap
  const staticSitemapXml = generateSitemapXML(staticUrls, 'static');
  fs.writeFileSync(
    path.join(process.cwd(), "public", "sitemap-static.xml"),
    staticSitemapXml
  );

  // Companies sitemap
  let companies = [];
  try {
    companies = await getServerCompanies();
    const companyUrls = companies.map((company) => ({
      url: `${baseUrl}/company/${company.slug ?? company.id}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    
    const companySitemapXml = generateSitemapXML(companyUrls, 'companies');
    fs.writeFileSync(
      path.join(process.cwd(), "public", "sitemap-companies.xml"),
      companySitemapXml
    );
  } catch (error) {
    console.error("Error generating companies sitemap:", error);
  }

  // Reviews sitemap
  let reviews = [];
  try {
    reviews = await getServerReviews();
    const reviewUrls = reviews.map((review) => ({
      url: `${baseUrl}/review/${review.id}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const reviewSitemapXml = generateSitemapXML(reviewUrls, 'reviews');
    fs.writeFileSync(
      path.join(process.cwd(), "public", "sitemap-reviews.xml"),
      reviewSitemapXml
    );
  } catch (error) {
    console.error("Error generating reviews sitemap:", error);
  }

  // Generate sitemap index
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${baseUrl}/sitemap-static.xml</loc>
        <lastmod>${lastModified}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${baseUrl}/sitemap-companies.xml</loc>
        <lastmod>${lastModified}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${baseUrl}/sitemap-reviews.xml</loc>
        <lastmod>${lastModified}</lastmod>
      </sitemap>
    </sitemapindex>`;

  fs.writeFileSync(
    path.join(process.cwd(), "public", "sitemap.xml"),
    sitemapIndex
  );

  return [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    }
  ];
}
