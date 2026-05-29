import { useEffect, useState } from "react";

type PaginationProps<T> = {
  data?: T[] | null;
  itemsPerPage: number;
  pageNumber: number;
};

export function usePagination<T>({
  data,
  itemsPerPage,
  pageNumber = 1,
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  useEffect(() => {
    setCurrentPage(pageNumber);
  }, [pageNumber]);

  const getPaginatedData = () => {
    if (!data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  return {
    currentPage,
    totalPages,
    getPaginatedData,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}
