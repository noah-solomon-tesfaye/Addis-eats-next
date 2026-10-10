"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

export default function Pagination() {
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const page = Math.max(1, Number.parseInt(pageParam || "1", 10));

  const { data, error, isLoading } = useSWR(
    `/api/dishes?page=${page}`,
    fetcher,
    { keepPreviousData: true }
  );

  if (error) {
    return (
      <p className="mt-6 text-sm text-red-600">
        Could not load dishes.
      </p>
    );
  }

  if (!data) {
    return (
      <p className="mt-6 text-sm text-gray-600">
        Loading dishes...
      </p>
    );
  }

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.dishes.map((dish) => (
          <div
            key={dish.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <h2 className="font-semibold">{dish.name}</h2>

            <p className="mt-1 text-sm text-gray-600">
              {dish.price} ETB
            </p>
          </div>
        ))}
      </div>

      {isLoading && (
        <p className="mt-3 text-sm text-gray-500">
          Loading next page...
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: data.totalPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <Link
              key={pageNumber}
              href={`/menu?page=${pageNumber}`}
              className={`rounded-lg border px-4 py-2 ${
                pageNumber === page
                  ? "bg-black text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>
    </div>
  );
}