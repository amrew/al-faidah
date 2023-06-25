import { Link, useNavigate } from "@remix-run/react";

export type PublisherTabProps = {
  publishers: Array<{
    title: string;
    slug: string;
  }>;
  currentPublisher?: string;
};

export function PublisherTab({
  publishers,
  currentPublisher,
}: PublisherTabProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="carousel hidden sm:flex">
        <div
          className={`carousel-item py-2 px-4 border-b-2 ${
            !currentPublisher
              ? "border-b-neutral-content font-bold"
              : "border-b-base-200"
          }`}
        >
          <Link to="/">Beranda</Link>
        </div>
        {publishers?.map((item) => (
          <div
            className={`carousel-item py-2 px-4 border-b-2 ${
              currentPublisher === item.slug
                ? "border-b-neutral-content font-bold"
                : "border-b-base-200"
            }`}
            key={item.title}
          >
            <Link to={`/?publisher=${item.slug}`}>{item.title}</Link>
          </div>
        ))}
      </div>
      <select
        className="select select-primary w-full sm:hidden"
        value={currentPublisher}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            navigate(`/?publisher=${value}`);
          } else {
            navigate("/");
          }
        }}
      >
        <option value="">Beranda</option>
        {publishers.map((item) => (
          <option key={item.title} value={item.slug}>
            {item.title}
          </option>
        ))}
      </select>
    </>
  );
}

export function PublisherTabLoading() {
  return (
    <>
      <div className="carousel hidden sm:flex">
        <div className={"carousel-item py-2 px-4 border-b-2 border-b-base-200"}>
          <Link to="/">Beranda</Link>
        </div>
        {[...Array(2)]?.map((_, idx) => (
          <div
            className={"carousel-item py-2 px-4 border-b-2 border-b-base-200"}
            key={idx}
          >
            <div className="bg-base-300 animate-pulse w-24" />
          </div>
        ))}
      </div>
      <select className="select select-primary w-full sm:hidden">
        <option value="">Beranda</option>
      </select>
    </>
  );
}
