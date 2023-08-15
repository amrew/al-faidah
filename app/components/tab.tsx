import { Link } from "@remix-run/react";
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
  return (
    <div className="overflow-x-auto hide-scrollbar">
      <nav className="flex flex-row">
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
    </div>
  );
}
