"use client";

const categories = [
  { value: "all", label: "All Dishes" },
  { value: "ethiopian", label: "Ethiopian" },
  { value: "fasting", label: "Fasting" },
  { value: "hot-drinks", label: "Hot Drinks" },
  { value: "juice-smoothie", label: "Juice & Smoothie" },
  { value: "burger", label: "Burger" },
  { value: "pizza", label: "Pizza" },
  { value: "pasta", label: "Pasta" },
  { value: "soft-drinks", label: "Soft Drinks" },
];

export default function CategoryBar({
  selectedCategory = "all",
  onCategoryChange,
  mobile = false,
}) {
  return (
    <nav
      aria-label="Filter dishes by category"
      className={
        mobile
          ? "flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-col gap-2"
      }
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onCategoryChange(category.value)}
            aria-pressed={isSelected}
            className={`min-h-11 shrink-0 rounded-xl border px-4 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
              mobile ? "whitespace-nowrap rounded-full" : "w-full"
            } ${
              isSelected
                ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-secondary)]"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </nav>
  );
}