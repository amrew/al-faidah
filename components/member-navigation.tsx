"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

export type MemberNavigationProps = {
  //
};

export function MemberNavigation({}: MemberNavigationProps) {
  const supabase = createClientComponentClient();

  const router = useRouter();
  const [isPending, setTransition] = useTransition();

  const [user, setUser] = useState<User | null | undefined>();
  const userMetadata = user?.user_metadata;
  const initial = userMetadata?.name?.slice(0, 1).toUpperCase();

  const logout = async () => {
    await supabase.auth.signOut();
    setTransition(() => {
      router.refresh();
    });
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      setUser(user.data.user);
    };
    getUser();

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = (
    <button className="btn-primary btn-disabled btn normal-case text-white btn-sm w-20" />
  );

  if (isPending) {
    return loading;
  }

  return user ? (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-ghost btn-circle avatar online placeholder"
      >
        <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
          <span className="text-xs">{initial}</span>
        </div>
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <button onClick={() => logout()}>Logout</button>
        </li>
      </ul>
    </div>
  ) : user === null ? (
    <>
      <Link href="/auth/login" className="btn-ghost btn normal-case btn-sm">
        Masuk
      </Link>
      <Link
        href="/auth/register"
        className="btn-primary btn normal-case text-white btn-sm"
      >
        Daftar
      </Link>
    </>
  ) : (
    loading
  );
}
