"use client";

import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

export function BackButton() {
  const router = useRouter();
  return (
    <button className="btn-ghost btn" onClick={() => router.back()}>
      <BiArrowBack size={20} /> Kembali
    </button>
  );
}
