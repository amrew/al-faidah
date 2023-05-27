import "./global.css";
import { HiMenuAlt2 } from "react-icons/hi";
import Link from "next/link";
import { AudioProvider } from "./audio-context";
import { Player } from "./player";
import { SideMenu } from "./sidemenu";

export const metadata = {
  title: "Al Faidah",
  description: "Belajar islam dengan pemahaman yang benar",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-theme="cupcake">
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
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <AudioProvider>
              <div className="drawer-content flex flex-col">
                <header className="navbar border-b border-solid border-gray-200 gap-2 bg-base-100">
                  <div className="flex-none">
                    <label
                      htmlFor="my-drawer-2"
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
                    <a className="btn-secondary btn normal-case text-white btn-sm">
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
            <div className="drawer-side border-r border-gray-200">
              <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
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
      </body>
    </html>
  );
}
