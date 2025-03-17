import {
  getServerCompanies,
  getServerCompanyBySlug,
  getMinimizedCompanies,
} from "@/utils/serverDataUtils";

// Export the server functions with the same names as before, so other code doesn't have to change
export const getAllCompanies = getServerCompanies;
export const getCompanyBySlug = getServerCompanyBySlug;
export const getMinimizedCompaniesData = getMinimizedCompanies;

// Remove any direct imports of large JSON files
// Remove any 'export const companies = [...]' that loads all data into the bundle
