import { Loader2 } from "lucide-react";
import React from "react";
import Image from "next/image";

const SplashScreen = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 ">
      <div className="text-center">
        <Image
          src="./cd.svg"
          width={100}
          height={100}
          alt="cascade logo"
          className="mx-auto mb-4 rounded-md"
        />
        <h1 className="text-4xl">Cascade</h1>
        <h2 className="text-xl text-muted-foreground">
          Production grade SaaS bootstrapped in minutes
        </h2>
        <p className=" text-xl text-muted-foreground"></p>
      </div>
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default SplashScreen;
