"use client";

import { signIn } from "next-auth/react";
import { Novatrix, Zenitho } from "uvcanvas";
import { SiDiscord, SiGoogle } from "@icons-pack/react-simple-icons";

import { Button } from "~/components/ui/button";

export function LoginScreen() {
  return (
    <div className="min-h-[800px] w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="absolute inset-0 block lg:hidden [&_canvas]:h-[100vh] [&_canvas]:w-[100vw]">
          <Zenitho />
        </div>
        <div className="relative mx-auto  grid w-[350px] gap-6 rounded-lg bg-background px-4 py-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Authenticate with a common provider
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              onClick={() =>
                signIn("discord", {
                  callbackUrl: "/app/subscriptions/?loginState=signedIn",
                })
              }
              variant="outline"
              className="w-full"
            >
              <SiDiscord className="mr-2 h-4 w-4" />
              Login with Discord
            </Button>
            <Button
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/app/subscriptions/?loginState=signedIn",
                })
              }
              variant="outline"
              className="w-full"
            >
              <SiGoogle className="mr-2 h-4 w-4" />
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
