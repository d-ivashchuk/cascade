import { CircleUser } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserButton = () => {
  const session = useSession();
  const isAuthenticated =
    session.status !== "loading" && session.status === "authenticated";

  return (
    <div>
      {isAuthenticated ? (
        <Avatar>
          <AvatarImage src={session.data.user.image ?? undefined} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ) : (
        <CircleUser />
      )}
    </div>
  );
};

export default UserButton;
