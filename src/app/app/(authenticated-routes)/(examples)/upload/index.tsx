"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import React from "react";
import { UploadWithDialog } from "~/components/patterns/file-upload/upload-dialog";
import useGuardedSpendCredits from "~/hooks/use-guard-usage";
import { api } from "~/trpc/react";

const UploadFile = () => {
  const session = useSession();
  const getUsageForUserQuery = api.paymentManagement.getUsageForUser.useQuery({
    feature: "fileUploads",
  });
  const guardedUsage = useGuardedSpendCredits("fileUploads");

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl">Change user profile picture</h2>
        <p className="text-md text-muted-foreground">
          This example uses uploadthing library, so the uploads are limited in
          this demo
        </p>
        <p className="text-md font-bold text-muted-foreground">
          You have spent{" "}
          {getUsageForUserQuery.data?.totalUsageForFeatureThisMonth} credits
          from {guardedUsage.availableCredits}
        </p>
      </div>
      {session.status === "authenticated" && (
        <div className="mb-2 ">
          <Avatar className="mb ">
            <AvatarImage
              className="h-[100px] w-[100px] rounded-full"
              src={session.data.user.image ?? undefined}
            />
            <AvatarFallback className="rounded-full">
              {session.data.user.name?.charAt(0) ??
                session.data.user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <UploadWithDialog />
    </div>
  );
};

export default UploadFile;
