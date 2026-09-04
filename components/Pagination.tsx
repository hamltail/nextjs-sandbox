import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => string;
  ariaLabel: string;
  scroll?: boolean;
};

type PaginationItem = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  getHref,
  ariaLabel,
  scroll = true,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(currentPage, totalPages);

  return (
    <nav
      aria-label={ariaLabel}
      className="mt-8 flex items-center justify-center gap-6"
    >
      {items.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="font-en text-muted px-1 py-2 text-base"
            >
              …
            </span>
          );
        }

        const isCurrentPage = item === currentPage;

        return (
          <Link
            key={item}
            href={getHref(item)}
            scroll={scroll}
            aria-current={isCurrentPage ? "page" : undefined}
            className={
              isCurrentPage
                ? "font-en text-accent after:bg-accent relative px-1 py-2 text-base font-semibold after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px"
                : "font-en nav-link text-muted hover:text-accent focus-visible:text-accent px-1 py-2 text-base transition-colors"
            }
          >
            {item}
          </Link>
        );
      })}
    </nav>
  );
}
