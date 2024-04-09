"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import React from "react";
import { UploadWithDialog } from "~/components/patterns/file-upload/upload-dialog";

const UploadFile = () => {
  const session = useSession();
  return (
    <div>
      <h2 className="mb-2 text-xl">Change user profile picture</h2>
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
