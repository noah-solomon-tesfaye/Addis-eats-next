"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

export default function SearchBox() {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(term);
    }, 300);

    return () => clearTimeout(timer);
  }, [term]);

  const { data, error, isLoading } = useSWR(
    debounced
      ? `/api/dishes?q=${encodeURIComponent(debounced)}`
      : null,
    fetcher,
    { keepPreviousData: true }
  );

  return (
    <div className="mb-6">
      <label
        htmlFor="dish-search"
        className="mb-2 block text-sm font-semibold"
      >
        Search dishes
      </label>

      <input
        id="dish-search"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search by dish name..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
      />

      {error && (
        <p className="mt-3 text-sm text-red-600">
          Could not load dishes.
        </p>
      )}

      {!error && debounced && isLoading && !data && (
        <p className="mt-3 text-sm text-gray-600">
          Loading...
        </p>
      )}

      {data && (
        <ul className="mt-4 space-y-2">
          {data.dishes.map((dish) => (
            <li
              key={dish.id}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
              {dish.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}