"use client";

import { useState, useCallback } from "react";
import CompanyCard from "@/components/CompanyCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBar from "@/components/SearchBar";
import debounce from "lodash/debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ITEMS_PER_PAGE = 32;

type SortOption = {
  value: string;
  label: string;
  sortFn: (a: any, b: any) => number;
};

const sortOptions: SortOption[] = [
  {
    value: "reviews-desc",
    label: "بیشترین نظرات",
    sortFn: (a, b) => (b.total_review || 0) - (a.total_review || 0),
  },
  {
    value: "rating-desc",
    label: "بالاترین امتیاز",
    sortFn: (a, b) => (b.rate || 0) - (a.rate || 0),
  },
  {
    value: "rating-asc",
    label: "پایین‌ترین امتیاز",
    sortFn: (a, b) => (a.rate || 0) - (b.rate || 0),
  },
  {
    value: "salary-desc",
    label: "بالاترین حقوق",
    sortFn: (a, b) => (b.salary_max || 0) - (a.salary_max || 0),
  },
  {
    value: "newest",
    label: "جدیدترین",
    sortFn: (a, b) =>
      new Date(b.created_at || "").getTime() -
      new Date(a.created_at || "").getTime(),
  },
];

export function HomeClient({
  data,
}: {
  data: {
    companyCount: number;
    featuredCompanies: any[];
    allCompanies: any[];
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || ""
  );
  const [searchResults, setSearchResults] = useState<any[]>(() => {
    const sortByParam = searchParams.get("sort") || "reviews-desc";
    const selectedSort = sortOptions.find((opt) => opt.value === sortByParam);
    if (selectedSort) {
      return [...data.allCompanies].sort(selectedSort.sortFn);
    }
    return data.allCompanies;
  });
  const [sortBy, setSortBy] = useState<string>(
    () => searchParams.get("sort") || "reviews-desc"
  );

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const normalizedQuery = query.toLowerCase().trim();
      let filtered = data.allCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(normalizedQuery) ||
          (company.description &&
            company.description.toLowerCase().includes(normalizedQuery))
      );

      const selectedSort = sortOptions.find((opt) => opt.value === sortBy);
      if (selectedSort) {
        filtered = [...filtered].sort(selectedSort.sortFn);
      }

      setSearchResults(filtered);
      setCurrentPage(1);
    }, 300),
    [sortBy, data.allCompanies]
  );

  const updateURL = useCallback(
    (page: number, query: string, sort: string) => {
      const params = new URLSearchParams();
      if (page > 1) params.set("page", page.toString());
      if (query) params.set("q", query);
      if (sort !== "reviews-desc") params.set("sort", sort);

      const newURL = `${window.location.pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;
      router.push(newURL);
    },
    [router]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateURL(1, query, sortBy);
    debouncedSearch(query);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL(currentPage, searchQuery, value);
    const selectedSort = sortOptions.find((opt) => opt.value === value);
    if (selectedSort) {
      setSearchResults((prev) => [...prev].sort(selectedSort.sortFn));
    }
  };

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCompanies = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateURL(pageNumber, searchQuery, sortBy);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      <div className="relative container mx-auto px-4 py-8 min-h-[100vh]">
        <div className="flex flex-col items-center justify-center h-[40vh] text-center mb-12">
          <h1
            className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-orange-500 h-20 leading-tight"
            style={{
              contain: "layout",
              fontDisplay: "swap",
            }}
          >
            اِکسپی
          </h1>
          <div className="flex flex-col items-center gap-2 mb-6 w-32 h-16">
            <div
              className="text-4xl font-bold text-gray-800 dark:text-gray-200"
              style={{ fontDisplay: "swap" }}
            >
              {data.companyCount.toLocaleString("fa-IR")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-full">
              تجربه ثبت شده
            </div>
          </div>
          {/* <Link
            href="/feed"
            className="text-orange-500 px-4 py-2 rounded-md mt-4 outline outline-2 outline-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-200 w-40 h-10 inline-flex items-center justify-center"
          >s
            مشاهده تجربه ها
          </Link> */}
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="جستجو در شرکت‌ها..."
          />
        </div>

        <div className="flex justify-between items-center mb-6 p-2 h-[64px]">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            لیست شرکت ها {searchQuery && `(${searchResults.length} نتیجه)`}
          </h2>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="مرتب‌سازی بر اساس" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap justify-center min-h-[200px]">
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              نتیجه‌ای یافت نشد
            </div>
          ) : (
            currentCompanies.map((company) => (
              <div
                key={company.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 min-h-[300px]"
              >
                <CompanyCard company={company} />
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8 h-[48px]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-label="قبی"
                  href="#"
                  size="default"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                >
                  قبلی
                </PaginationPrevious>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;

                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  pageNumber === currentPage ||
                  pageNumber === currentPage - 1 ||
                  pageNumber === currentPage + 1
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        size="default"
                        href="#"
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber.toLocaleString("fa-IR")}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 &&
                    currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  size="default"
                  href="#"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  بعدی
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
