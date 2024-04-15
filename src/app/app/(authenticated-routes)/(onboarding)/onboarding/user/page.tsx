"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";

const Onboarding = () => {
  const session = useSession();
  const [name, setName] = React.useState(session.data?.user.name ?? "");
  const utils = api.useUtils();
  const getUserQuery = api.user.getUser.useQuery();
  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      router.push("/app/onboarding/settings");
    },
  });
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <motion.div
        transition={{ delay: 0.3, duration: 0.4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-center text-4xl font-bold tracking-tight">
          {session.status === "authenticated"
            ? `Welcome, ${name.length > 0 ? name : getUserQuery.data?.name}`
            : "Welcome to Pullout.so"}
        </h1>
        <h2 className="text-center text-xl text-muted-foreground">
          Change your name or avatar so we can personalize your experience
        </h2>
      </motion.div>
      <motion.div
        transition={{ delay: 0.4, duration: 0.4 }}
        initial={{ x: "-5px", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mx-auto flex w-fit gap-2 "
      >
        <Input
          className="mx-auto max-w-[200px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          disabled={updateUserMutation.isPending}
          onClick={() => {
            updateUserMutation.mutate({ name });
          }}
          className="mx-auto w-fit"
        >
          {updateUserMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ChevronRight className="mr-2 h-4 w-4" />
          )}
          Next
        </Button>
      </motion.div>
    </div>
  );
};

export default Onboarding;
