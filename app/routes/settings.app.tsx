import {
  json,
  type V2_MetaFunction,
  type LoaderArgs,
  redirect,
} from "@remix-run/node";
import { Link, NavLink, useLoaderData, useNavigate } from "@remix-run/react";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { TwoColumn } from "~/components/two-column";
import { APP_URL, QUOTA_CREATION } from "~/components/utils";
import { useSupabase } from "~/hooks/useSupabase";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Settings App - Al Faidah" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const { supabase, response } = createServerSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile: {
    is_verified: boolean;
    role_id: number | null;
  } | null = { is_verified: false, role_id: null };

  if (user) {
    const { data } = await supabase
      .from("user_profiles")
      .select("is_verified, role_id")
      .eq("user_id", user.id)
      .single();

    userProfile = data;
  }

  const isVerified = userProfile?.is_verified;
  const roleId = userProfile?.role_id;

  if (!isVerified) {
    return redirect("/auth/verify", {
      headers: response.headers,
    });
  }

  const { data: radios } = await supabase
    .from("radios")
    .select("id, title, theme, items")
    .eq("user_id", user?.id);

  return json(
    {
      radios,
      roleId,
    },
    { headers: response.headers }
  );
};

function generateIFrameTemplate(
  src: string,
  dimensions: { width?: string; height?: string }
) {
  return `<iframe 
  src="${src}"
  scrolling="no"
  frameborder="0" 
  ${dimensions.width ? `width="${dimensions.width}"` : ""}
  ${dimensions.height ? `height="${dimensions.height}"` : ""}></iframe>`;
}

export default function SettingsApp() {
  const { radios, roleId } = useLoaderData<typeof loader>();
  const radiosLength = radios?.length || 0;

  const supabase = useSupabase();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <TwoColumn
      reversed
      right={
        <ul className="menu bg-base-200 rounded-lg gap-1">
          <li>
            <NavLink to="/settings/app">Radio</NavLink>
          </li>
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
        </ul>
      }
      left={
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 justify-between items-center">
            <h1 className="text-xl font-bold">Radio</h1>
            <h1 className="text-xs">
              Kuota {radiosLength} / {roleId ? "∞" : QUOTA_CREATION}
            </h1>
          </div>
          {roleId === 1 || radiosLength < QUOTA_CREATION ? (
            <div>
              <Link to="/settings/embed" className="btn btn-primary btn-sm">
                Buat Radio
              </Link>
            </div>
          ) : null}
          <div className="flex flex-col gap-4">
            {radios?.map((item, index) => (
              <div
                key={item.id}
                className="collapse collapse-arrow bg-base-200"
              >
                <input
                  type="radio"
                  name="my-accordion-1"
                  defaultChecked={index === 0}
                />
                <div className="collapse-title text-xl font-medium">
                  {item?.title}
                </div>
                <div className="collapse-content gap-2 flex flex-col overflow-x-auto">
                  <div className="mockup-code w-full">
                    <pre>
                      <code>
                        {generateIFrameTemplate(
                          `${APP_URL}/e/radios/${item.id}`,
                          { width: "320", height: "480" }
                        )}
                      </code>
                    </pre>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      to={`/settings/embed?id=${item.id}`}
                      className="btn btn-accent btn-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}