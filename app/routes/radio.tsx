import { Outlet, useOutletContext } from "@remix-run/react";
import { RefreshButton } from "~/components/refresh-button";
import { SharedLayout } from "~/components/shared-layout";

export default function Radio() {
  const context = useOutletContext();
  return (
    <SharedLayout
      contentClassname="h-full"
      hasBackButton
      footer={
        <div className="relative max-w-5xl mx-auto">
          <RefreshButton />
        </div>
      }
    >
      <Outlet context={context} />
    </SharedLayout>
  );
}
