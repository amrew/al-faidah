import { useOutletContext } from "@remix-run/react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export function useSupabase() {
  const context = useOutletContext<{
    supabase: SupabaseClient;
  }>();
  return context?.supabase;
}

export function useUser() {
  const context = useOutletContext<{
    user: User;
  }>();
  return context?.user;
}
