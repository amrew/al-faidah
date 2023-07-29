import { Outlet, useOutletContext } from "@remix-run/react";
import { SharedLayout } from "~/components/shared-layout";

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
