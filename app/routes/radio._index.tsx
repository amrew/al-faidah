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

  if (type === "syariah") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/auth/login?messageType=syariah-radio", {
        headers: response.headers,
      });
    }

    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("is_verified")
      .eq("user_id", user.id)
      .single();

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
    },
    { headers: response.headers }
  );
};

export default function Radio() {
  const { radios, teachers, type } = useLoaderData<typeof loader>();
  return <RadioListWithFilter items={radios} teachers={teachers} type={type} />;
}
