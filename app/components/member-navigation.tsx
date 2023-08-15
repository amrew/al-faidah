import { BsBookmark } from "react-icons/bs";
import { useSupabase, useUser } from "~/hooks/useSupabase";
import { Link, useNavigate } from "@remix-run/react";

export function MemberNavigation() {
  const supabase = useSupabase();
  const navigate = useNavigate();

  const user = useUser();

  const userMetadata = user?.user_metadata;
  const firstName = userMetadata?.name?.split(" ")[0];
  const initial = userMetadata?.name?.slice(0, 1).toUpperCase();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return user ? (
    <>
      <Link to="/favorite/radio" className="btn btn-ghost btn-circle btn-sm">
        <BsBookmark />
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
          className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 gap-2 z-50"
        >
          <li>
            <Link to="/settings/radio">Radio App</Link>
          </li>
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
        </ul>
      </div>
    </>
  ) : (
    <>
      <Link to="/auth/login" className="btn-ghost btn normal-case btn-sm">
        Masuk
      </Link>
      <Link
        to="/auth/register"
        className="btn-primary btn normal-case text-white btn-sm"
      >
        Daftar
      </Link>
    </>
  );
}
