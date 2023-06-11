"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "./user-context";
import { BsBookmarkFill } from "react-icons/bs";

export type MemberNavigationProps = {
  //
};

export function MemberNavigation({}: MemberNavigationProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const { user } = useContext(UserContext);
  const userMetadata = user?.user_metadata;
  const firstName = userMetadata?.name?.split(" ")[0];
  const initial = userMetadata?.name?.slice(0, 1).toUpperCase();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const loading = (
    <button className="btn-primary btn-disabled btn normal-case text-white btn-sm w-20" />
  );

  return user ? (
    <>
      <Link
        href="/radio/favorite"
        className="btn btn-ghost btn-circle btn-sm"
        prefetch={false}
      >
        <BsBookmarkFill className="text-accent" />
      </Link>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost avatar placeholder gap-2">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
            <span className="text-xs">{initial}</span>
          </div>
          <div>{firstName}</div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 gap-2"
        >
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
        </ul>
      </div>
    </>
  ) : user === null ? (
    <>
      <Link
        href="/auth/login"
        prefetch={false}
        className="btn-ghost btn normal-case btn-sm"
      >
        Masuk
      </Link>
      <Link
        prefetch={false}
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
