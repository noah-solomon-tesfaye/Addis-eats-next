"use client";

export default function FilterShell({ children }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-[#e9e2d7] bg-[#faf8f3]/95 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
      <div
        className="
          -mx-1 flex items-center gap-2
          overflow-x-auto overscroll-x-contain
          px-1 pb-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:flex-wrap sm:overflow-visible sm:pb-0
        "
      >
        {children}
      </div>
    </div>
  );
}