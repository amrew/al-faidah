"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { HiRefresh } from "react-icons/hi";

export type RefreshButtonProps = {
  refreshInterval?: number;
};

export function RefreshButton(props: RefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (props.refreshInterval) {
      let timer: NodeJS.Timer | undefined = undefined;

      const startLongPooling = () => {
        timer = setInterval(() => {
          router.refresh();
        }, props.refreshInterval);
      };
      const pauseLongPooling = () => {
        clearInterval(timer);
      };

      startLongPooling();

      window.addEventListener("focus", startLongPooling);
      window.addEventListener("blur", pauseLongPooling);
      return () => {
        clearInterval(timer);
        window.removeEventListener("focus", startLongPooling);
        window.removeEventListener("blur", pauseLongPooling);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
