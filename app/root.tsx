import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LoaderArgs, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useRevalidator,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { useEffect, useState } from "react";
import {
  createBrowserClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import { Provider } from "./components/provider";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    GA_ID: process.env.GA_ID!,
  };

  const response = new Response();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  const [sessionResult, userResult] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ]);

  const {
    data: { session },
  } = sessionResult;

  const {
    data: { user },
  } = userResult;

  return json(
    {
      env,
      session,
      user,
    },
    {
      headers: response.headers,
    }
  );
};

export default function App() {
  const { env, session, user } = useLoaderData<typeof loader>();
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={navigation.state === "loading" ? "navigate-loading" : ""}
      >
        <Provider>
          <Outlet context={{ supabase, user }} />
        </Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {env.GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${env.GA_ID}`}
            />
            <script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.GA_ID}');
            `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
