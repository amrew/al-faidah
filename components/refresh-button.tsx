"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { HiRefresh } from "react-icons/hi";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="btn btn-accent btn-circle absolute bottom-4 right-4"
      onClick={() =>
        startTransition(() => {
          router.refresh();
        })
      }
    >
      <HiRefresh size={24} className={isPending ? "animate-spin" : ""} />
    </button>
  );
}
