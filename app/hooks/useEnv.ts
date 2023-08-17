import { useOutletContext } from "@remix-run/react";

export function useEnv() {
  const context = useOutletContext<{
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      GA_ID?: string;
      APP_URL: string;
    };
  }>();
  return context?.env;
}
