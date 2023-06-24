"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export type PublisherTabProps = {
  publishers: Array<{
    title: string;
    slug: string;
  }>;
  currentPublisher: string;
};

export function PublisherTab({
  publishers,
  currentPublisher,
}: PublisherTabProps) {
  const router = useRouter();

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
          <Link href="/" prefetch={false}>
            Beranda
          </Link>
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
            <Link href={`/?publisher=${item.slug}`} prefetch={false}>
              {item.title}
            </Link>
          </div>
        ))}
      </div>
      <select
        className="select select-primary w-full sm:hidden"
        value={currentPublisher}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            router.push(`/?publisher=${value}`);
          } else {
            router.push("/");
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
          <Link href="/" prefetch={false}>
            Beranda
          </Link>
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
