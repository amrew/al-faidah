import { getTracks } from "~/components/radio/radio-service.server";
import {
  json,
  redirect,
  type LoaderArgs,
  type V2_MetaFunction,
  type ActionArgs,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { QUOTA_CREATION } from "~/utils/constant";
import { type ThemeName, themes } from "~/utils/themeUtils";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { RadioList } from "~/components/radio/radio-list";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { v4 as uuidv4 } from "uuid";
import { SharedLayout } from "~/components/shared-layout";
import { appConfig } from "~/utils/appConfig";

export const meta: V2_MetaFunction = () => {
  return [{ title: `Settings Embed - ${appConfig.title}` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const radios = await getTracks();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const { supabase, response } = createServerSupabase(request);

  const { data: currentItem } = await supabase
    .from("radios")
    .select("id, title, items, theme")
    .eq("id", id)
    .single();

  return json(
    {
      id,
      currentItem,
      radios,
    },
    { headers: response.headers }
  );
};

export const action = async ({ request }: ActionArgs) => {
  const url = new URL(request.url);
  const { supabase, response } = createServerSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const getRadiosCount = async () => {
    const { count } = await supabase
      .from("radios")
      .select("id, title, theme, items", { count: "exact", head: true })
      .eq("user_id", user?.id);
    return count;
  };

  const getUserProfile = async () => {
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("is_verified, role_id")
      .eq("user_id", user?.id)
      .single();
    return userProfile;
  };

  const [count, userProfile] = await Promise.all([
    getRadiosCount(),
    getUserProfile(),
  ]);

  if (
    !userProfile ||
    (userProfile?.role_id !== 1 && (count || 0) >= QUOTA_CREATION)
  ) {
    return redirect("/settings/radio", { headers: response.headers });
  }

  const body = await request.formData();

  const title = body.get("title");
  const items = body.get("items");
  const theme = body.get("theme");

  if (
    typeof title !== "string" ||
    typeof items !== "string" ||
    typeof theme !== "string" ||
    !title ||
    !items ||
    !theme
  ) {
    return json(
      {
        error: {
          name: "ValidationError",
          message: "Email dan password harus diisi",
        },
      },
      { status: 400 }
    );
  }

  const id = url.searchParams.get("id") || uuidv4().split("-")[0].toUpperCase();

  const { error } = await supabase.from("radios").upsert({
    id,
    theme,
    title,
    user_id: user?.id,
    items: items.split(","),
  });

  if (error) {
    return json(
      {
        error: {
          name: error.code,
          message: error.message,
        },
      },
      { status: 400 }
    );
  }

  return redirect("/settings/radio", { headers: response.headers });
};

export default function Radio() {
  const { radios, currentItem } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [theme, setTheme] = useState<ThemeName>(currentItem?.theme || "rii");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    currentItem?.items.reduce(
      (acc: string[], v: string) => ({
        ...acc,
        [v]: true,
      }),
      {}
    ) || {}
  );

  const radioIds = Object.keys(checkedItems).filter((key) => {
    return checkedItems[key];
  });

  const renderForm = () => {
    return (
      <Form method="post" className="h-full">
        <div className="flex flex-1 flex-row p-4 md:p-8 gap-8 h-5/6">
          <div className="w-1/3 h-full">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text font-bold">Nama Radio</span>
              </label>
              <input
                name="title"
                type="text"
                defaultValue={currentItem?.title}
                placeholder="Isi nama radio..."
                className="input input-bordered w-full max-w-xs rounded-md"
                required
              />
            </div>
            <div className="mt-2">
              <label className="label">
                <span className="label-text font-bold">Pilih Radio</span>
              </label>
              <div className="overflow-y-auto h-96 flex flex-col gap-4">
                {radios
                  .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                  })
                  .map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex flex-row gap-3 items-center border-base-300 rounded-md bg-base-100 shadow-sm border p-2"
                      >
                        <img
                          loading="lazy"
                          src={item.logoUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-md"
                          width={80}
                          height={80}
                        />
                        <h2
                          className={`flex-1 line-clamp-1 font-semibold text-md text-base-content`}
                        >
                          {item.name}
                        </h2>
                        <input
                          type="checkbox"
                          name={item.alias}
                          checked={checkedItems[item.alias]}
                          className="checkbox"
                          onChange={(event) => {
                            setCheckedItems((prev) => ({
                              ...prev,
                              [event.target.name]: event.target.checked,
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="mt-4">
                <input type="hidden" name="theme" value={theme} />
                <input type="hidden" name="items" value={radioIds.join(",")} />
                <button
                  className="btn btn-accent"
                  type="submit"
                  disabled={navigation.state !== "idle"}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="carousel gap-2 mt-4">
                {themes.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className={`btn btn-ghost btn-xs text-white carousel-item ${item.color}`}
                    onClick={() => setTheme(item.name)}
                  >
                    {item.name}
                    {item.name === theme ? <BiCheck size={20} /> : null}
                  </button>
                ))}
              </div>
            </div>
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div
                  className="artboard artboard-demo phone-1 overflow-y-auto justify-start pt-8"
                  data-theme={theme}
                >
                  <div className="flex flex-col gap-2 mx-2">
                    <RadioList
                      items={radios.filter((item) => {
                        return checkedItems[item.alias];
                      })}
                      embed
                      disabledRefreshInterval
                      getDetailUrl={() => "#"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  };
  return (
    <SharedLayout hasBackButton contentClassName="h-full pb-0">
      {renderForm()}
    </SharedLayout>
  );
}
