import { Outlet, useOutletContext } from "@remix-run/react";
import { SharedLayout } from "~/components/shared-layout";

export default function Artikel() {
  const context = useOutletContext();
  return (
    <SharedLayout>
      <Outlet context={context} />
    </SharedLayout>
  );
}
