import { useOutletContext, useRevalidator } from "@remix-run/react";
import Cookies from "universal-cookie";
import { appConfig } from "~/utils/appConfig";

export function useTheme() {
  const context = useOutletContext<{
    theme: string;
  }>();
  const revalidator = useRevalidator();
  const toggleTheme = () => {
    const cookies = new Cookies();
    cookies.set(
      "theme",
      appConfig.theme === context.theme ? appConfig.themeDark : appConfig.theme
    );
    revalidator.revalidate();
  };
  return { theme: context?.theme, toggleTheme };
}
