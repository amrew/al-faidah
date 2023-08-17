import { getTracks } from "~/components/radio/radio-service.server";
import { RadioListWithFilter } from "~/components/radio/radio-list-with-filter";
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
import { appConfig } from "~/utils/appConfig";

export const meta: V2_MetaFunction = () => {
  return [
    { title: `Radio - ${appConfig.title}` },
    {
      name: "description",
      content: "Berisi kajian Asatidzah Ahlus Sunnah Wal Jama'ah",
    },
  ];
};

const teachers = [
  {
    name: "Abdul Mu'thi Sutarman",
    keyword: "abdul muthi sutarman",
  },
  {
    name: "Abu Hamzah Shodiqun",
    keyword: "shodiqun",
  },
  {
    name: "Abu Hamzah Yusuf",
    keyword: "hamzah yusuf",
  },
  {
    name: "Abu Humayd Fauzi",
    keyword: "humayd fauzi",
  },
  {
    name: "Abu Nasim Mukhtar",
    keyword: "nasim mukhtar",
  },
  {
    name: "Afifuddin As-Sidawi",
    keyword: "afifuddin",
  },
  {
    name: "Ayip Syafruddin",
    keyword: "ayip",
  },
  {
    name: "Muhammad bin Umar Assewed",
    keyword: "umar",
  },
  {
    name: "Muhammad Rijal",
    keyword: "rijal",
  },
  {
    name: "Qomar Suaidi",
    keyword: "qomar suaidi",
  },
  {
    name: "Saiful Bahri",
    keyword: "saiful bahri",
  },
  {
    name: "Usamah bin Faishal Mahri",
    keyword: "usamah mahri",
  },
];

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

  const radios = await getTracks({ type });

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
      <div
        className="sticky right-0 mb-4 pt-2 pb-2 bg-base-100"
        style={{ top: 64, zIndex: 1 }}
      >
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
      </div>
      <RadioListWithFilter items={radios} teachers={teachers} type={type} />
    </div>
  );
}
