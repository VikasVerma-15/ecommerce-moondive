"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function SyncSession({ children }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.backendToken) {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== session.backendToken) {
        localStorage.setItem("token", session.backendToken);
        if (session.isAdmin) {
          localStorage.setItem("isAdmin", "true");
        } else {
          localStorage.removeItem("isAdmin");
        }
        // Force reload so Navbar and api interceptor pick up the localStorage change
        window.location.reload();
      }
    }
  }, [session, status]);

  return <>{children}</>;
}

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <SyncSession>{children}</SyncSession>
    </SessionProvider>
  );
}
