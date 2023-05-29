import "./global.css";
import { HiMenuAlt2 } from "react-icons/hi";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { AudioProvider } from "./audio-context";
import { Player } from "./player";
import { SideMenu } from "./sidemenu";
import { cookies } from "next/headers";
import { get } from "@vercel/edge-config";

export const metadata = {
  title: "Al Faidah",
  description: "Belajar islam dengan pemahaman yang benar",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const proxyUrl = await get<string>("proxyUrl");
  return (
    <html lang="en" data-theme={theme?.value || "cupcake"}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <div className="flex h-full flex-1 flex-col">
          <div className="drawer drawer-mobile">
            <input id="drawer-1" type="checkbox" className="drawer-toggle" />
            <AudioProvider proxyUrl={proxyUrl}>
              <div className="drawer-content flex flex-col">
                <header className="navbar border-b border-solid gap-2 bg-base-100 border-b-base-300">
                  <div className="flex-none">
                    <label
                      htmlFor="drawer-1"
                      className="btn-ghost btn-square btn drawer-button lg:hidden"
                    >
                      <HiMenuAlt2 size={20} />
                    </label>
                  </div>
                  {/*  */}
                  <div className="flex-1">
                    <Link
                      href="/"
                      className="btn-ghost btn text-xl normal-case lg:hidden"
                    >
                      Al Faidah
                    </Link>
                  </div>
                  <div className="flex-none gap-2 mr-2 ml-2">
                    <a className="btn-ghost btn normal-case btn-sm">Masuk</a>
                    <a className="btn-accent btn normal-case text-white btn-sm">
                      Daftar
                    </a>
                  </div>
                </header>
                <main className="flex flex-col h-full bg-base-200 overflow-y-auto">
                  {children}
                </main>
                <Player />
              </div>
            </AudioProvider>
            <div className="drawer-side border-r border-base-300">
              <label htmlFor="drawer-1" className="drawer-overlay"></label>
              <div className="bg-base-100 w-56">
                <div className="p-4">
                  <Link href="/" className="btn-ghost btn text-xl normal-case">
                    Al Faidah
                  </Link>
                </div>
                <SideMenu />
                {/*  */}
              </div>
              {/*  */}
            </div>
            {/*  */}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
