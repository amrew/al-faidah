import { Link, useNavigate } from "@remix-run/react";

export type TabProps = {
  items: Array<{
    id: string;
    title: string;
    href: string;
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
      <div className="flex-row flex-wrap hidden sm:flex">
        {items?.map((item) => (
          <div
            className={`py-2 px-4 border-b-2 ${
              currentId === item.id
                ? "border-b-neutral-content font-bold"
                : "border-b-base-200"
            }`}
            key={item.title}
          >
            <Link to={item.href}>{item.title}</Link>
          </div>
        ))}
      </div>
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
        {items.map((item) => (
          <option key={item.title} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>
    </>
  );
}
