"use client";

import { signIn } from "next-auth/react";
import { Novatrix } from "uvcanvas";

import { Button } from "~/components/ui/button";

export function LoginScreen() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Authenticate with a common provider
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              onClick={() =>
                signIn("discord", { callbackUrl: "/?loginState=signedIn" })
              }
              variant="outline"
              className="w-full"
            >
              Login with Discord
            </Button>
            <Button
              onClick={() =>
                signIn("google", { callbackUrl: "/?loginState=signedIn" })
              }
              variant="outline"
              className="w-full"
            >
              Login with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block [&_canvas]:rounded-lg">
        <Novatrix />
      </div>
    </div>
  );
}
