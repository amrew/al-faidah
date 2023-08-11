import {
  json,
  redirect,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import { SharedLayout } from "~/components/shared-layout";
import { isLoggedIn } from "~/utils/authUtils.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Settings - Al Faidah" }];
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
  return (
    <SharedLayout hasBackButton contentClassName="h-full pb-0">
      <Outlet context={context} />
    </SharedLayout>
  );
}
