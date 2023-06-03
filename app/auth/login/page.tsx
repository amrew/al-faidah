import { FcGoogle } from "react-icons/fc";

export default function AuthLogin() {
  return (
    <div className="flex h-full items-center justify-center bg-base-200">
      <form action="">
        <div className="max-w-sm rounded-md p-px border border-base-300 bg-base-100 shadow-sm">
          <div className="rounded-m px-10 p-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl text-center">Al Faidah</h1>
              <div>
                <h2 className="text-xl font-semibold">Masuk ke akun</h2>
                <p className="text-sm tracking-wide">
                  Tidak punya akun?{" "}
                  <a
                    href=""
                    className="text-primary transition duration-200 hover:underline"
                  >
                    Daftar
                  </a>{" "}
                  gratis
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div className="space-y-6">
                <input
                  className="input input-bordered w-full"
                  placeholder="Email"
                  type="email"
                  name="email"
                />

                <input
                  className="input input-bordered w-full"
                  placeholder="Password"
                  type="password"
                  name="password"
                />
              </div>

              <div className="flex flex-col w-full border-opacity-50">
                <button className="btn btn-primary w-full text-white">
                  Masuk
                </button>
                <div className="divider text-sm">atau menggunakan</div>
                <button className="btn btn-outline w-full gap-2">
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
