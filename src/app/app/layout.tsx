"use client";

import { useSession } from "next-auth/react";
import { usePathname, redirect } from "next/navigation";
import { useEffect } from "react";
import SplashScreen from "~/components/patterns/splash-screen";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const allowedUnauthenticatedPaths = ["/app/login", "/"];

    if (
      status !== "loading" &&
      status !== "authenticated" &&
      !allowedUnauthenticatedPaths.includes(pathname)
    ) {
      redirect("/app/login");
    }
  }, [status, pathname]);

  if (status === "loading" && pathname.includes("/app"))
    return <SplashScreen />;
  return <>{children}</>;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoutes>{children}</ProtectedRoutes>;
}
