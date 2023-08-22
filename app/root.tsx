import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LoaderArgs, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { Provider } from "./components/provider";
import { createServerSupabase } from "./clients/createServerSupabase";
import { BiChevronLeft } from "react-icons/bi";
import { appConfig } from "./utils/appConfig";
import ReactGA from "react-ga4";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    GA_ID: process.env.GA_ID!,
    APP_URL: process.env.APP_URL || appConfig.url,
  };

  const { supabase, response } = createServerSupabase(request);

  const sessionResult = await supabase.auth.getSession();

  const {
    data: { session },
  } = sessionResult;

  return json(
    {
      env,
      session,
    },
    {
      headers: response.headers,
    }
  );
};

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  const navigation = useNavigation();

  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );
  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== "INITIAL_SESSION" &&
        session?.access_token !== serverAccessToken
      ) {
        // server and client are out of sync.
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, revalidate]);

  useEffect(() => {
    if (env.GA_ID) {
      ReactGA.initialize(env.GA_ID);
    }
  }, []);

  useEffect(() => {
    if (env.GA_ID && navigation.location) {
      ReactGA.send({
        hitType: "pageview",
        page: navigation.location?.pathname + navigation.location?.search,
      });
    }
  }, [navigation.location]);

  return (
    <html lang="en" data-theme={appConfig.theme}>
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
        <link
          rel="preconnect"
          href="https://fmpdtfhmuqxfzmaxxsge.supabase.co"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <Meta />
        <Links />
      </head>
      <body
        className={navigation.state === "loading" ? "navigate-loading" : ""}
      >
        <Provider>
          <Outlet context={{ env, supabase, user: session?.user }} />
        </Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  // when true, this is what used to go to `CatchBoundary`
  const isErrorRoute = isRouteErrorResponse(error);

  const renderErrorMessage = () => {
    if (isErrorRoute) {
      return (
        <div className="flex flex-col gap-6 max-w-md p-6">
          <h1 className="font-bold text-5xl text-base-content">
            Uppsss... {error.status}
          </h1>
          <p className="text-2xl">{error.statusText}</p>
          <div className="flex flex-col gap-2">
            <p className="font-light">
              Mohon periksa kembali link yang Anda tuju. Jika Anda meyakini ini
              merupakan sebuah error, jangan ragu untuk menghubungi Admin Al
              Faidah.
            </p>
            <p>Jazakumullah Khoiron</p>
          </div>
          <div>
            <a href="/" className="btn btn-sm btn-error text-white">
              <BiChevronLeft />
              Kembali ke Beranda
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-6 max-w-md p-6">
          <h1 className="font-bold text-5xl text-base-content">
            Uppsss... 500
          </h1>
          <p className="text-2xl">Telah terjadi kesalahan pada sistem</p>
          <div className="flex flex-col gap-2">
            <p className="font-light">
              Halaman ini tampaknya mengalami kesalahan. Anda bisa menghubungi
              Admin {appConfig.title} jika memungkinkan.
            </p>
            <p>Jazakumullah Khoiron</p>
          </div>
          <div>
            <a href="/" className="btn btn-sm btn-error text-white">
              <BiChevronLeft />
              Kembali ke Beranda
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <html lang="en" data-theme="rii">
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
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="robots" content="noindex" />
        <title>
          {isErrorRoute ? error.statusText : "Sistem Error"} - {appConfig.title}
        </title>
        <Links />
      </head>
      <body>
        <div className="flex flex-col h-full justify-center items-center">
          {renderErrorMessage()}
        </div>
      </body>
    </html>
  );
}
