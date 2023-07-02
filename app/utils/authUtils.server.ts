import Cookies from "universal-cookie";

export async function isLoggedIn(req: Request) {
  const cookies = new Cookies(req.headers.get("Cookie"));
  const hasSupabaseToken = cookies.get(process.env.AUTH_COOKIE_KEY!);
  return !!hasSupabaseToken;
}
