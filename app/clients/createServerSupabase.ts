import { createServerClient } from "@supabase/auth-helpers-remix";

export function createServerSupabase(request: Request, secret?: string) {
  const response = new Response();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    secret || process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  return { supabase, response };
}
