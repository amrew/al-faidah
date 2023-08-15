import { FcGoogle } from "react-icons/fc";
import { useMutation } from "react-query";
import { BiMailSend } from "react-icons/bi";
import { ImWarning } from "react-icons/im";
import { useSupabase } from "~/hooks/useSupabase";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { BackButton } from "~/components/back-button";
import {
  redirect,
  json,
  type LoaderArgs,
  type V2_MetaFunction,
  type ActionArgs,
} from "@remix-run/node";
import { isLoggedIn } from "~/utils/authUtils.server";
import { createServerSupabase } from "~/clients/createServerSupabase";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedIn = await isLoggedIn(request);
  if (loggedIn) {
    return redirect("/");
  }

  const url = new URL(request.url);
  const messageType = url.searchParams.get("messageType");

  return json({ messageType });
};

export const action = async ({ request }: ActionArgs) => {
  const { origin } = new URL(request.url);

  const { supabase, response } = createServerSupabase(request);

  const body = await request.formData();

  const name = body.get("name");
  const email = body.get("email");
  const password = body.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name ||
    !email ||
    !password
  ) {
    return json(
      {
        type: "error",
        error: {
          name: "ValidationError",
          message: "Semua data harus diisi",
        },
      },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return json(
      {
        type: "error",
        error: {
          name: error.name,
          message: error.message,
        },
      },
      { status: 400 }
    );
  }

  return json({ type: "success", error: null }, { headers: response.headers });
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Register - Radio Islam" }];
};

export default function AuthRegister() {
  const supabase = useSupabase();
  const navigation = useNavigation();
  const { messageType } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const googleMutation = useMutation(async () => {
    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (result.error) {
      throw result.error;
    }
  });

  const form = (
    <Form method="post" className="space-y-4">
      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Nama Lengkap"
          type="text"
          name="name"
          required
        />
        <input
          className="input input-bordered w-full"
          placeholder="Email"
          type="email"
          name="email"
          required
        />
        <input
          className="input input-bordered w-full"
          placeholder="Password"
          type="password"
          name="password"
          required
        />
      </div>
      <div className="flex flex-col w-full border-opacity-50">
        <button
          type="submit"
          className="btn btn-primary w-full text-white"
          disabled={navigation.state !== "idle"}
        >
          Daftar
        </button>
        <div className="divider text-sm">atau menggunakan</div>
        <button
          type="button"
          className="btn btn-outline w-full gap-2"
          disabled={googleMutation.isLoading}
          onClick={() => googleMutation.mutate()}
        >
          <FcGoogle size={20} /> Google
        </button>
      </div>
    </Form>
  );

  return (
    <div className="flex h-full sm:items-center sm:justify-center bg-base-200">
      <div className="sm:max-w-sm rounded-md p-px border border-base-300 bg-base-100 shadow-sm">
        <div className="px-6 py-4 sm:hidden">
          <BackButton />
        </div>
        <main className="rounded-m px-10 pt-4 sm:pt-10 pb-10">
          <div className="flex flex-col gap-2">
            <div>
              <h2 className="text-xl font-semibold">Daftar akun</h2>
              <p className="text-sm tracking-wide">
                Sudah punya akun?{" "}
                <Link
                  to={
                    messageType
                      ? `/auth/login?messageType=${messageType}`
                      : `/auth/login`
                  }
                  className="text-primary transition duration-200 hover:underline"
                >
                  Masuk disini
                </Link>
              </p>
            </div>
          </div>
          {actionData?.type === "error" && actionData?.error ? (
            <div className="alert alert-error mt-4 justify-start">
              <ImWarning />
              <span>Lengkapi data dengan benar</span>
            </div>
          ) : null}
          <div className="mt-4">
            {actionData?.type === "success" ? (
              <div className="flex flex-1 flex-col text-center items-center">
                <BiMailSend size={48} />
                <p>Silahkan cek email anda untuk mengkonfirmasi akun.</p>
                <Link to="/" className="btn btn-primary mt-4">
                  Ke Beranda
                </Link>
              </div>
            ) : (
              form
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
