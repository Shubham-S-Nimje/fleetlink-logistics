import React from "react";
import Button from "../Button";

const Pagination = (pagination, setFilters) => {
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} results
      </div>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>

        {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              size="sm"
              variant={pagination.page === page ? "primary" : "outline"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
