"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImWarning } from "react-icons/im";
import { useMutation } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const supabase = createClientComponentClient();

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
        router.push("/");
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
    <div className="flex h-full items-center justify-center bg-base-200">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="max-w-sm rounded-md p-px border border-base-300 bg-base-100 shadow-sm">
          <div className="rounded-m px-10 p-12">
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="text-xl font-semibold">Masuk ke akun</h2>
                <p className="text-sm tracking-wide">
                  Tidak punya akun?{" "}
                  <Link
                    href="/auth/register"
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
