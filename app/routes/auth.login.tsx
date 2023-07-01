import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImInfo, ImWarning } from "react-icons/im";
import { useMutation } from "react-query";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useSupabase } from "~/hooks/useSupabase";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { BackButton } from "~/components/back-button";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const messageType = url.searchParams.get("messageType");

  return json({
    messageType,
  });
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Login - Al Faidah" }];
};

export default function AuthLogin() {
  const { messageType } = useLoaderData<typeof loader>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const supabase = useSupabase();

  const mutation = useMutation(
    async () => {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (result.error) {
        throw result.error;
      }
    },
    {
      onSuccess: () => {
        navigate("/");
      },
    }
  );

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
          <span>
            {messageType === "radio-like"
              ? "Login dulu sebelum menyimpan radio"
              : messageType === "article-like"
              ? "Login dulu sebelum menyimpan artikel"
              : null}
          </span>
        </div>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="h-full sm:h-auto"
      >
        <div className="sm:max-w-sm h-full sm:h-auto rounded-md p-px border border-base-300 bg-base-100 shadow-sm">
          <div className="px-6 py-4 sm:hidden">
            <BackButton />
          </div>
          <div className="rounded-m px-10 pt-4 sm:pt-10 pb-10">
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-xl font-semibold">Masuk ke akun</h2>
                <p className="text-sm tracking-wide">
                  Tidak punya akun?{" "}
                  <Link
                    to="/auth/register"
                    className="text-primary transition duration-200 hover:underline"
                  >
                    Daftar
                  </Link>{" "}
                  gratis
                </p>
              </div>
            </div>
            {mutation.error ? (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col w-full border-opacity-50">
                <button
                  type="submit"
                  className="btn btn-primary w-full text-white"
                  disabled={mutation.isLoading}
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
          </div>
        </div>
      </form>
    </div>
  );
}
