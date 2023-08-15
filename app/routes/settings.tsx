import {
  json,
  redirect,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import {
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { SharedLayout } from "~/components/shared-layout";
import { TwoColumn } from "~/components/two-column";
import { useSupabase } from "~/hooks/useSupabase";
import { isLoggedIn } from "~/utils/authUtils.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Settings - Radio Islam" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const loggedIn = await isLoggedIn(request);
  if (!loggedIn) {
    return redirect("/auth/login");
  }
  return json({});
};

export default function Radio() {
  const context = useOutletContext();

  const supabase = useSupabase();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <SharedLayout hasBackButton contentClassName="h-full pb-0">
      <TwoColumn
        reversed
        rightClassName="md:w-3/12 xl:w-2/12"
        leftClassName="md:w-9/12 xl:w-10/12"
        right={
          <ul className="menu bg-base-200 rounded-lg gap-1">
            <li>
              <NavLink to="/settings/article">Artikel</NavLink>
            </li>
            <li>
              <NavLink to="/settings/radio">Radio</NavLink>
            </li>
            <li>
              <button onClick={() => logout()}>Logout</button>
            </li>
          </ul>
        }
        left={<Outlet context={context} />}
      />
    </SharedLayout>
  );
}
