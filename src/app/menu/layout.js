import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-5 overflow-x-clip px-4 py-5 sm:px-6 sm:py-8 lg:flex-row lg:gap-8 lg:px-12">
      {/* Categories: horizontal bar on mobile, sidebar on desktop */}
      <aside className="w-full min-w-0 lg:w-64 lg:shrink-0">
        <div className="rounded-xl border border-[#e9e2d7] bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-6">
          <h2 className="mb-3 text-lg font-bold text-[#29443a] sm:text-xl lg:mb-5">
            Categories
          </h2>

          <CategoryBar />
        </div>
      </aside>

      {/* Menu content */}
      <main className="w-full min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}