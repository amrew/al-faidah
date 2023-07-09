import { Link, useNavigate } from "@remix-run/react";
import { BiLock } from "react-icons/bi";

export type TabProps = {
  items: Array<{
    id: string;
    title: string;
    href: string;
    hide?: boolean;
    private?: boolean;
  }>;
  currentId?: string;
};

export function Tab({ items, currentId }: TabProps) {
  const navigate = useNavigate();
  const idHrefMap = items.reduce<Record<string, string>>((acc, item) => {
    return { ...acc, [item.id]: item.href };
  }, {});

  return (
    <>
      <nav className="carousel hidden sm:flex">
        {items
          .filter((item) => !item.hide)
          .map((item) => (
            <div
              className={`carousel-item py-2 px-4 border-b-2 ${
                currentId === item.id
                  ? "border-b-neutral-content font-bold"
                  : "border-b-base-200"
              }`}
              key={item.title}
            >
              <Link to={item.href} className="flex flex-row gap-1">
                {item.title} {item.private ? <BiLock /> : null}
              </Link>
            </div>
          ))}
      </nav>
      <select
        className="select select-primary w-full sm:hidden"
        value={currentId}
        onChange={(e) => {
          const value = e.target.value;
          const href = idHrefMap[value];
          if (href) {
            navigate(href);
          }
        }}
      >
        {items
          .filter((item) => !item.hide)
          .map((item) => (
            <option key={item.title} value={item.id}>
              {item.title}
            </option>
          ))}
      </select>
    </>
  );
}
