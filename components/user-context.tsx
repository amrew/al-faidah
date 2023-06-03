"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import type { PropsWithChildren } from "react";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext<{ user: User | null | undefined }>({
  user: undefined,
});

export function UserProvider(props: PropsWithChildren) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null | undefined>();

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      setUser(user.data.user);
    };
    getUser();

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {props.children}
    </UserContext.Provider>
  );
}
