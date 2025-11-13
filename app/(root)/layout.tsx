import { isUserLoggedInAndGetId } from "@/features/api/auth/services/auth-services";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("a")?.value as string;

  if (!accessToken) {
    redirect("/login");
  }

  const result = await isUserLoggedInAndGetId();

  console.log(result);
  return <div className="select-none">{children}</div>;
};

export default Layout;
