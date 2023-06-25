import { useRevalidator } from "@remix-run/react";
import { HiRefresh } from "react-icons/hi";

export function RefreshButton() {
  const { revalidate, state } = useRevalidator();

  return (
    <button
      className="btn btn-accent btn-circle absolute bottom-4 right-4"
      onClick={() => revalidate()}
    >
      <HiRefresh
        size={24}
        className={state === "loading" ? "animate-spin" : ""}
      />
    </button>
  );
}
