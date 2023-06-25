import { Outlet, useOutletContext } from "@remix-run/react";
import { RefreshButton } from "~/components/refresh-button";
import { SharedLayout } from "~/components/shared-layout";

export default function Radio() {
  const context = useOutletContext();
  return (
    <SharedLayout
      footer={
        <div className="relative">
          <RefreshButton />
        </div>
      }
    >
      <Outlet context={context} />
    </SharedLayout>
  );
}
