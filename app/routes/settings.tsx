import { type LoaderArgs, json, redirect } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import { SharedLayout } from "~/components/shared-layout";
import { isLoggedIn } from "~/utils/authUtils.server";

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
    <SharedLayout
      hasBackButton
      contentStyle={{ height: "100%", paddingBottom: 0 }}
    >
      <Outlet context={context} />
    </SharedLayout>
  );
}
