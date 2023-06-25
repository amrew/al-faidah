import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useMutation } from "react-query";
import { BiMailSend } from "react-icons/bi";
import { ImWarning } from "react-icons/im";
import { useSupabase } from "~/clients/useSupabase";
import { Link } from "@remix-run/react";
import { BackButton } from "~/components/back-button";
import { type V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Register - Al Faidah" }];
};

export default function AuthRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = useSupabase();

  const mutation = useMutation(async () => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (result.error) {
      throw result.error;
    }
  });

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-4"
    >
      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Nama Lengkap"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
    </form>
  );

  return (
    <div className="flex h-full sm:items-center sm:justify-center bg-base-200">
      <div className="sm:max-w-sm rounded-md p-px border border-base-300 bg-base-100 shadow-sm">
        <div className="px-6 py-4 sm:hidden">
          <BackButton />
        </div>
        <div className="rounded-m px-10 pt-4 sm:pt-10 pb-10">
          <div className="flex flex-col gap-2">
            <div>
              <h2 className="text-xl font-semibold">Daftar akun</h2>
              <p className="text-sm tracking-wide">
                Sudah punya akun?{" "}
                <Link
                  to="/auth/login"
                  className="text-primary transition duration-200 hover:underline"
                >
                  Masuk disini
                </Link>
              </p>
            </div>
          </div>
          {mutation.error ? (
            <div className="alert alert-error mt-4 justify-start">
              <ImWarning />
              <span>Lengkapi data dengan benar</span>
            </div>
          ) : null}
          <div className="mt-4">
            {mutation.isSuccess ? (
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
        </div>
      </div>
    </div>
  );
}
