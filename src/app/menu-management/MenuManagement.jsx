"use client";

import { useCallback, useEffect, useState } from "react";

const EMPTY_DISH = {
  name: "",
  description: "",
  price: "",
  category: "ethiopian",
  image: "",
  isFasting: false,
  spiceLevel: "Mild 😊",
  ingredients: "",
  discountPer: "0",
  available: true,
};

const CATEGORIES = [
  { value: "ethiopian", label: "Ethiopian" },
  { value: "fasting", label: "Fasting" },
  { value: "drinks", label: "Drinks" },
  { value: "desserts", label: "Desserts" },
];

const SPICE_LEVELS = ["Mild 😊", "Medium 🌶️", "Hot 🔥"];

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString()} ETB`;
}

function getErrorMessage(data, fallback) {
  return data?.error || fallback;
}

export default function MenuManagement() {
  const [dishes, setDishes] = useState([]);
  const [form, setForm] = useState(EMPTY_DISH);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDishes = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      // Load all dishes instead of only the first six.
      const response = await fetch("/api/dishes?all=true", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to load dishes.")
        );
      }

      if (!Array.isArray(data.dishes)) {
        throw new Error("The server returned invalid dish data.");
      }

      setDishes(data.dishes);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load dishes.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Load data asynchronously to avoid synchronous state updates in the effect.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      loadDishes(controller.signal);
    }, 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [loadDishes]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_DISH);
    setEditingId(null);
  }

  function startEditing(dish) {
    setError("");
    setSuccess("");
    setEditingId(dish.id);

    setForm({
      name: dish.name || "",
      description: dish.description || "",
      price: String(dish.price ?? ""),
      category: dish.category || "ethiopian",
      image: dish.image || "",
      isFasting: Boolean(dish.isFasting),
      spiceLevel: dish.spiceLevel || "Mild 😊",
      ingredients: Array.isArray(dish.ingredients)
        ? dish.ingredients.join(", ")
        : "",
      discountPer: String(dish.discountPer ?? 0),
      available: dish.available !== false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const price = Number(form.price);
    const discountPer = Number(form.discountPer);

    if (!form.name.trim()) {
      setError("Please enter a dish name.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Please enter a valid non-negative price.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (
      form.discountPer.trim() === "" ||
      !Number.isFinite(discountPer) ||
      discountPer < 0 ||
      discountPer > 100
    ) {
      setError("Discount must be between 0 and 100.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      image: form.image.trim(),
      isFasting: form.isFasting,
      spiceLevel: form.spiceLevel,
      ingredients: form.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
      discountPer,
      available: form.available,
    };

    setSaving(true);

    try {
      const url = editingId
        ? `/api/dishes/${encodeURIComponent(editingId)}`
        : "/api/dishes";

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Could not save the dish.")
        );
      }

      setSuccess(
        editingId
          ? `${payload.name} updated successfully.`
          : `${payload.name} added successfully.`
      );

      resetForm();

      await loadDishes();
    } catch (err) {
      setError(err.message || "Could not save the dish.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(dish) {
    setError("");
    setSuccess("");

    // If currently unavailable, this action makes it available.
    const newAvailability = dish.available === false;

    try {
      const response = await fetch(
        `/api/dishes/${encodeURIComponent(dish.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: newAvailability,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Could not update availability.")
        );
      }

      if (!data.dish) {
        throw new Error(
          "The server did not return the updated dish."
        );
      }

      setDishes((current) =>
        current.map((item) =>
          item.id === dish.id ? data.dish : item
        )
      );

      // Keep the edit form in sync if this dish is being edited.
      if (editingId === dish.id) {
        setForm((current) => ({
          ...current,
          available: newAvailability,
        }));
      }

      setSuccess(
        `${dish.name} is now ${
          newAvailability ? "available" : "unavailable"
        }.`
      );
    } catch (err) {
      setError(
        err.message || "Could not update dish availability."
      );
    }
  }

  async function handleDelete(dish) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${dish.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/dishes/${encodeURIComponent(dish.id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Could not delete the dish.")
        );
      }

      setDishes((current) =>
        current.filter((item) => item.id !== dish.id)
      );

      if (editingId === dish.id) {
        resetForm();
      }

      setSuccess(`${dish.name} was deleted successfully.`);
    } catch (err) {
      setError(err.message || "Could not delete the dish.");
    }
  }

  const filteredDishes = dishes.filter((dish) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      dish.name?.toLowerCase().includes(searchText) ||
      dish.description?.toLowerCase().includes(searchText) ||
      dish.id?.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "all" ||
      dish.category === categoryFilter;

    const isAvailable = dish.available !== false;

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && isAvailable) ||
      (availabilityFilter === "unavailable" && !isAvailable);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAvailability
    );
  });

  const availableCount = dishes.filter(
    (dish) => dish.available !== false
  ).length;

  const unavailableCount = dishes.length - availableCount;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
              Addis Eats Administration
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Menu Management
            </h1>

            <p className="mt-2 text-gray-600">
              Manage dishes, prices, ingredients, and availability.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadDishes()}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Menu"}
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
          >
            {success}
          </div>
        )}

        <section
          aria-label="Menu summary"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <SummaryCard
            label="Total Dishes"
            value={dishes.length}
            description="Dishes in your menu"
          />

          <SummaryCard
            label="Available"
            value={availableCount}
            description="Marked available for ordering"
          />

          <SummaryCard
            label="Unavailable"
            value={unavailableCount}
            description="Marked unavailable for ordering"
          />
        </section>

        <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Dish" : "Add New Dish"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the selected dish details."
                  : "Enter the details for a new menu item."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Dish Name" htmlFor="dish-name">
                <input
                  id="dish-name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  required
                  maxLength={100}
                  placeholder="e.g. Gomen"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Price (ETB)" htmlFor="dish-price">
                <input
                  id="dish-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={updateField}
                  required
                  placeholder="350"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Category" htmlFor="dish-category">
                <select
                  id="dish-category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  className={inputClass}
                >
                  {CATEGORIES.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Spice Level" htmlFor="dish-spice">
                <select
                  id="dish-spice"
                  name="spiceLevel"
                  value={form.spiceLevel}
                  onChange={updateField}
                  className={inputClass}
                >
                  {SPICE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Image Path" htmlFor="dish-image">
                <input
                  id="dish-image"
                  name="image"
                  value={form.image}
                  onChange={updateField}
                  placeholder="/images/Gomen.jpg"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Discount (%)"
                htmlFor="dish-discount"
              >
                <input
                  id="dish-discount"
                  name="discountPer"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={form.discountPer}
                  onChange={updateField}
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              htmlFor="dish-description"
            >
              <textarea
                id="dish-description"
                name="description"
                value={form.description}
                onChange={updateField}
                required
                rows={3}
                maxLength={1000}
                placeholder="Describe the dish..."
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Ingredients"
              htmlFor="dish-ingredients"
            >
              <input
                id="dish-ingredients"
                name="ingredients"
                value={form.ingredients}
                onChange={updateField}
                placeholder="Collard Greens, Garlic, Ginger, Oil"
                className={inputClass}
              />

              <p className="mt-1 text-xs text-gray-500">
                Separate ingredients with commas.
              </p>
            </FormField>

            <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="isFasting"
                  checked={form.isFasting}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 accent-orange-600"
                />

                <span>
                  <span className="block font-semibold">
                    Fasting-friendly dish
                  </span>

                  <span className="text-sm text-gray-500">
                    Mark this dish as suitable for fasting.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 accent-green-600"
                />

                <span>
                  <span className="block font-semibold">
                    Available for ordering
                  </span>

                  <span className="text-sm text-gray-500">
                    Uncheck this when the dish is sold out.
                  </span>
                </span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Dish"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold transition hover:bg-gray-100"
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5 sm:p-7">
            <h2 className="text-xl font-bold">All Menu Dishes</h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredDishes.length} of {dishes.length} dishes.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label
                  htmlFor="dish-search"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Search
                </label>

                <input
                  id="dish-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search dishes..."
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="all">All Categories</option>

                  {CATEGORIES.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="availability-filter"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Availability
                </label>

                <select
                  id="availability-filter"
                  value={availabilityFilter}
                  onChange={(event) =>
                    setAvailabilityFilter(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="all">All Dishes</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading all menu dishes...
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg font-semibold">No dishes found</p>
              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Dish</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4">Availability</th>
                      <th className="px-5 py-4">Fasting</th>
                      <th className="px-5 py-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredDishes.map((dish) => {
                      const available = dish.available !== false;

                      return (
                        <tr
                          key={dish.id}
                          className={
                            available
                              ? "hover:bg-gray-50"
                              : "bg-red-50/40 hover:bg-red-50"
                          }
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold">
                              {dish.name}
                            </div>

                            <div className="mt-1 max-w-xs truncate text-xs text-gray-500">
                              {dish.description}
                            </div>

                            <div className="mt-1 text-xs text-gray-400">
                              ID: {dish.id}
                            </div>
                          </td>

                          <td className="px-5 py-4 capitalize">
                            {dish.category}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-semibold">
                            {formatPrice(dish.price)}

                            {Number(dish.discountPer) > 0 && (
                              <div className="mt-1 text-xs text-green-700">
                                {dish.discountPer}% discount
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <AvailabilityBadge available={available} />
                          </td>

                          <td className="px-5 py-4">
                            {dish.isFasting ? "Yes" : "No"}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(dish)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleAvailability(dish)}
                                className={
                                  available
                                    ? "rounded-md border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50"
                                    : "rounded-md border border-green-300 px-3 py-2 text-xs font-semibold text-green-800 hover:bg-green-50"
                                }
                              >
                                {available
                                  ? "Mark Sold Out"
                                  : "Mark Available"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(dish)}
                                className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                {filteredDishes.map((dish) => {
                  const available = dish.available !== false;

                  return (
                    <article
                      key={dish.id}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-bold">{dish.name}</h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {dish.description}
                          </p>
                        </div>

                        <AvailabilityBadge available={available} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-semibold">
                            {formatPrice(dish.price)}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">Category</p>
                          <p className="capitalize">{dish.category}</p>
                        </div>

                        <div>
                          <p className="text-gray-500">Fasting</p>
                          <p>{dish.isFasting ? "Yes" : "No"}</p>
                        </div>

                        <div>
                          <p className="text-gray-500">Discount</p>
                          <p>{dish.discountPer ?? 0}%</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(dish)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAvailability(dish)}
                          className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50"
                        >
                          {available ? "Mark Sold Out" : "Mark Available"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(dish)}
                          className="col-span-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete Dish
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function FormField({ label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

function SummaryCard({ label, value, description }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </article>
  );
}

function AvailabilityBadge({ available }) {
  return (
    <span
      className={
        available
          ? "inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800"
          : "inline-flex whitespace-nowrap rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800"
      }
    >
      {available ? "Available" : "Unavailable"}
    </span>
  );
}