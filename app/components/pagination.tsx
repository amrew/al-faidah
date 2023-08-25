import { Link } from "@remix-run/react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export type PaginationProps = {
  page: number;
  totalPage: number;
  buildUrl: (page: number) => string;
};

export function Pagination(props: PaginationProps) {
  const { page, totalPage, buildUrl } = props;
  const isFirstPage = page === 1;
  const hasMorePage = totalPage > page;

  if (totalPage <= 1) {
    return null;
  }

  return (
    <div className="join">
      <Link to={buildUrl(page - 1)} preventScrollReset={false}>
        <button
          className="join-item btn"
          disabled={isFirstPage}
          aria-label="Halaman sebelumnya"
        >
          <BiChevronLeft size={22} />
        </button>
      </Link>
      {page - 1 > 0 ? (
        <Link to={buildUrl(1)}>
          <button className="join-item btn" aria-label={`Halaman ${page - 1}`}>
            1
          </button>
        </Link>
      ) : null}
      {page - 2 > 0 ? (
        <button className="join-item btn" aria-label="Halaman lainnya">
          ...
        </button>
      ) : null}
      <button
        className="join-item btn btn-active btn-secondary"
        aria-label="Halaman saat ini"
      >
        {page}
      </button>
      {hasMorePage ? (
        <Link to={buildUrl(page + 1)}>
          <button className="join-item btn" aria-label={`Halaman ${page + 1}`}>
            {page + 1}
          </button>
        </Link>
      ) : null}
      {page + 2 < totalPage ? (
        <button className="join-item btn" aria-label="Halaman lainnya">
          ...
        </button>
      ) : null}
      {page + 1 < totalPage ? (
        <Link to={buildUrl(totalPage)}>
          <button className="join-item btn" aria-label={`Halaman ${page + 1}`}>
            {totalPage}
          </button>
        </Link>
      ) : null}
      <Link to={buildUrl(page + 1)}>
        <button
          className="join-item btn"
          disabled={!hasMorePage}
          aria-label="Halaman selanjutnya"
        >
          <BiChevronRight size={22} />
        </button>
      </Link>
    </div>
  );
}
