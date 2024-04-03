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
          <AvatarFallback>
            {session.data.user.name?.charAt(0) ??
              session.data.user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <CircleUser />
      )}
    </div>
  );
};

export default UserButton;
