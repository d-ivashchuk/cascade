import { Loader2 } from "lucide-react";
import React from "react";

const SplashScreen = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl">Cascade SaaS</h1>
        <p className=" text-xl text-muted-foreground">
          #1 open-source Next.js SaaS template
        </p>
      </div>
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default SplashScreen;
