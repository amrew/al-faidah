import { ImInfo, ImWarning } from "react-icons/im";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  json,
  redirect,
  type V2_MetaFunction,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/node";
import { BackButton } from "~/components/back-button";
import { v4 as uuidv4 } from "uuid";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { isLoggedIn } from "~/utils/authUtils.server";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedIn = await isLoggedIn(request);
  if (!loggedIn) {
    return redirect("/auth/login");
  }
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const { supabase, response } = createServerSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const body = await request.formData();
  const code = body.get("code");

  if (typeof code !== "string") {
    return json(
      {
        error: {
          name: "ValidationError",
          message: "Kode harus diisi",
        },
      },
      { status: 400 }
    );
  }

  const { data: userProfile, error } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("invitation_code", code.toUpperCase())
    .single();

  if (error || !userProfile) {
    return json(
      {
        error: {
          name: "ValidationError",
          message: error.message,
        },
      },
      { status: 400 }
    );
  }

  const invitationCode = uuidv4();

  const { count } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  const data = {
    user_id: user.id,
    is_verified: true,
    referral_id: userProfile.user_id,
    invitation_code: invitationCode.split("-")[0].toUpperCase(),
  };

  if (count === 0) {
    await supabase.from("user_profiles").upsert(data).eq("user_id", user.id);
  } else {
    await supabase.from("user_profiles").update(data).eq("user_id", user.id);
  }

  return redirect("/radio?type=syariah", { headers: response.headers });
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Verifikasi - Al Faidah" }];
};

export default function AuthLogin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <div className="flex flex-col h-full sm:items-center sm:justify-center bg-base-200 gap-4">
      <Form method="post" className="h-full sm:h-auto">
        <div className="sm:max-w-sm h-full sm:h-auto rounded-md p-px border border-base-300 bg-base-100 shadow-sm">
          <div className="px-6 py-4 sm:hidden">
            <BackButton />
          </div>
          <main className="rounded-m px-10 pt-4 sm:pt-10 pb-10">
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-xl font-semibold">Masukkan Kode Akses</h2>
                <p className="text-sm tracking-wide">
                  untuk bisa mengakses Radio Syariah
                </p>
              </div>
            </div>
            {actionData?.error ? (
              <div className="alert alert-error mt-4 justify-start">
                <ImWarning />
                <span>Kode Akses Tidak Ditemukan</span>
              </div>
            ) : null}
            <div className="mt-4 space-y-4">
              <div className="space-y-4">
                <input
                  className="input input-bordered w-full"
                  placeholder="Kode Akses"
                  type="text"
                  name="code"
                  required
                />
              </div>
              <div className="flex flex-col w-full border-opacity-50">
                <button
                  type="submit"
                  className="btn btn-primary w-full text-white"
                  disabled={navigation.state !== "idle"}
                >
                  Kirim
                </button>
              </div>
            </div>
            <div className="alert mt-4 justify-start">
              <ImInfo />
              <span>Dapatkan kode akses dari teman kamu</span>
            </div>
          </main>
        </div>
      </Form>
    </div>
  );
}
