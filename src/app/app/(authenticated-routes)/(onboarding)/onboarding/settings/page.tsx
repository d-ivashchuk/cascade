"use client";

import { useSession } from "next-auth/react";

import React from "react";

import { api } from "~/trpc/react";

const Onboarding = () => {
  const session = useSession();

  const getUserQuery = api.user.getUser.useQuery();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h1 className="text-center text-4xl font-bold tracking-tight">
          {session.status === "authenticated"
            ? `Welcome, ${getUserQuery.data?.name}`
            : "Welcome to Pullout.so"}
        </h1>
        <h2 className="text-center text-xl text-muted-foreground">
          Change your name or avatar so we can personalize your experience
        </h2>
      </div>
    </div>
  );
};

export default Onboarding;
