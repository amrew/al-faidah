import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import { AudioProvider } from "~/components/audio-context";
import { Provider } from "~/components/provider";

export const metadata = {
  title: "Al Faidah",
  description: "Belajar islam dengan pemahaman yang benar",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-theme={"cupcake"}>
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
        <Provider>
          <AudioProvider>{children}</AudioProvider>
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
