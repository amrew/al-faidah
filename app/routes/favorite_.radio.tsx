import { getTracks } from "~/components/radio/radio-service.server";
import { RadioList } from "~/components/radio/radio-list";
import {
  type LoaderArgs,
  json,
  type V2_MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SharedLayout } from "~/components/shared-layout";
import { RefreshButton } from "~/components/refresh-button";
import { Tab } from "~/components/tab";
import { TwoColumn } from "~/components/two-column";
import { isLoggedIn } from "~/utils/authUtils.server";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedIn = await isLoggedIn(request);
  if (!loggedIn) {
    return redirect(`/auth/login?messageType=favorite-page`);
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  const radios = await getTracks({
    type: type === "syariah" ? "syariah" : "rii",
  });

  return json({
    radios,
  });
};

export const meta: V2_MetaFunction = () => {
  return [{ title: `Radio Favorite - ${appConfig.title}` }];
};

export default function FavoriteRadios() {
  const { radios } = useLoaderData<typeof loader>();
  return (
    <SharedLayout
      footer={
        <div className="relative max-w-5xl mx-auto">
          <RefreshButton />
        </div>
      }
    >
      <TwoColumn
        reversed
        left={
          <>
            <h1 className="text-xl md:text-3xl mt-2 mb-4">Disimpan</h1>
            <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
              <Tab
                currentId="radio"
                items={[
                  {
                    id: "radio",
                    title: "Radio",
                    href: `/favorite/radio`,
                  },
                  {
                    id: "artikel",
                    title: "Artikel",
                    href: `/favorite/artikel`,
                  },
                ]}
              />
            </div>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioList
                favorite
                items={radios}
                getDetailUrl={(item) => `/radio/${item.alias}`}
              />
            </main>
          </>
        }
        right={null}
      />
    </SharedLayout>
  );
}
