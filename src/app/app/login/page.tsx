import React from "react";

import { redirect } from "next/navigation";
import { LoginScreen } from "~/components/patterns/login-screen";
import { getServerAuthSession } from "~/server/auth";

const LoginPage = async () => {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect("/app/usage");
  }

  return (
    <div>
      <LoginScreen />
    </div>
  );
};

export default LoginPage;
