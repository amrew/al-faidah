import { getAll } from "@vercel/edge-config";
import { getTracks } from "~/components/radio-service";
import { RadioListWithFilter } from "~/components/radio-list-with-filter";
import type { FilterOption } from "~/components/radio-entity";
import {
  json,
  type V2_MetaFunction,
  type LoaderArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { Tab } from "~/components/tab";
import { useUser } from "~/hooks/useSupabase";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Radio Islam Indonesia - Al Faidah" },
    {
      name: "description",
      content: "Berisi kajian Asatidzah Ahlus Sunnah Wal Jama'ah",
    },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") === "syariah" ? "syariah" : "rii";

  const { supabase, response } = createServerSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile: {
    is_verified: boolean;
  } | null = { is_verified: false };

  if (user) {
    const { data } = await supabase
      .from("user_profiles")
      .select("is_verified")
      .eq("user_id", user.id)
      .single();

    userProfile = data;
  }

  if (type === "syariah") {
    if (!user) {
      return redirect("/auth/login?messageType=syariah-radio", {
        headers: response.headers,
      });
    }

    if (!userProfile || !userProfile?.is_verified) {
      return redirect("/auth/verify", { headers: response.headers });
    }
  }

  const [radios, { teachers }] = await Promise.all([
    getTracks({ type }),
    getAll<{ teachers: FilterOption[]; topics: FilterOption[] }>(["teachers"]),
  ]);

  return json(
    {
      radios,
      teachers,
      type,
      isVerified: userProfile?.is_verified,
    },
    { headers: response.headers }
  );
};

export default function Radio() {
  const { radios, teachers, type, isVerified } = useLoaderData<typeof loader>();
  const user = useUser();
  return (
    <div className="flex flex-col p-4 md:p-8 gap-4">
      <Tab
        currentId={type == "syariah" ? "syariah" : "rii"}
        items={[
          { id: "rii", title: "RII", href: "/radio" },
          {
            id: "syariah",
            title: "Syariah",
            href: "/radio?type=syariah",
            hide: !user,
            private: !isVerified,
          },
        ]}
      />
      <RadioListWithFilter items={radios} teachers={teachers} type={type} />
    </div>
  );
}
