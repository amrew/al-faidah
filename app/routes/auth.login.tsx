import { FcGoogle } from "react-icons/fc";
import { ImInfo, ImWarning } from "react-icons/im";
import { useMutation } from "react-query";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useSupabase } from "~/hooks/useSupabase";
import {
  json,
  redirect,
  type V2_MetaFunction,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/node";
import { BackButton } from "~/components/back-button";
import { isLoggedIn } from "~/utils/authUtils.server";
import { createServerSupabase } from "~/clients/createServerSupabase";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedIn = await isLoggedIn(request);
  if (loggedIn) {
    return redirect("/");
  }

  const url = new URL(request.url);
  const messageType = url.searchParams.get("messageType");

  return json({
    messageType,
  });
};

export const action = async ({ request }: ActionArgs) => {
  const url = new URL(request.url);
  const messageType = url.searchParams.get("messageType");
  const { supabase, response } = createServerSupabase(request);

  const body = await request.formData();

  const email = body.get("email");
  const password = body.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return json(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      { status: 400 }
    );
  }

  switch (messageType) {
    case "radio-like":
      return redirect("/radio", { headers: response.headers });
    case "favorite-page":
      return redirect("/favorite/artikel", { headers: response.headers });
    case "syariah-radio":
      return redirect("/radio?type=syariah", { headers: response.headers });
    case "gpt-summary":
      const target = url.searchParams.get("target");
      if (target?.match(/\/([\w-]+)\/([\w-]+)/g)) {
        return redirect(target, {
          headers: response.headers,
        });
      }
    default:
      return redirect("/", { headers: response.headers });
  }
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Login - Radio Islam" }];
};

const messageMap: Record<string, string> = {
  "radio-like": "Login dulu sebelum menyimpan radio",
  "article-like": "Login dulu sebelum menyimpan artikel",
  "favorite-page": "Login dulu sebelum melihat halaman favorit",
  "syariah-radio": 'Login dulu untuk mendengarkan "Radio Syariah"',
  "gpt-summary": 'Login dulu untuk melihat "Rangkuman"',
};

export default function AuthLogin() {
  const { messageType } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const supabase = useSupabase();

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

  return (
    <div className="flex flex-col h-full sm:items-center sm:justify-center bg-base-200 gap-4">
      {messageType ? (
        <div className="w-full sm:max-w-sm alert alert-error mt-4 justify-start flex flex-row">
          <ImInfo size={20} />
          <span>{messageMap[messageType]}</span>
        </div>
      ) : null}
      <Form method="post" className="h-full sm:h-auto">
        <div className="sm:max-w-sm h-full sm:h-auto rounded-md p-px border border-base-300 bg-base-100 shadow-sm">
          <div className="px-6 py-4 sm:hidden">
            <BackButton />
          </div>
          <main className="rounded-m px-10 pt-4 sm:pt-10 pb-10">
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-xl font-semibold">Masuk ke akun</h2>
                <p className="text-sm tracking-wide">
                  Tidak punya akun?{" "}
                  <Link
                    to={
                      messageType
                        ? `/auth/register?messageType=${messageType}`
                        : `/auth/register`
                    }
                    className="text-primary transition duration-200 hover:underline"
                  >
                    Daftar
                  </Link>{" "}
                  gratis
                </p>
              </div>
            </div>
            {actionData?.error ? (
              <div className="alert alert-error mt-4 justify-start">
                <ImWarning />
                <span>Email atau password salah</span>
              </div>
            ) : null}
            <div className="mt-4 space-y-4">
              <div className="space-y-4">
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
                  Masuk
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
            </div>
          </main>
        </div>
      </Form>
    </div>
  );
}
