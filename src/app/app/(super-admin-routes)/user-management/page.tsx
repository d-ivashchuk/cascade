"use client";
import { Separator } from "~/components/ui/separator";
import { AlertCircle } from "lucide-react";
import React from "react";
import { UserTableProvider } from "~/components/patterns/data-table/data-table-provider";
import { UserTable } from "~/components/patterns/data-table/user-table/user-table";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";

const UserManagement = () => {
  return (
    <div>
      <div>
        <h1 className="mb-2 text-2xl">User management</h1>
        <h2 className="text-md text-muted-foreground">
          On this screen you can see all of the users in the system.
        </h2>
        <Alert className="mt-4 max-w-4xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            For demo purposes some random users are shown here. In production
            you should restrict access to this page. To see real users you need
            to modify your user role in the database and set it to{" "}
            <b>SUPER_ADMIN</b>.
          </AlertDescription>
        </Alert>
      </div>

      <Separator className="my-4" />

      <UserTableProvider>
        <UserTable />
      </UserTableProvider>
    </div>
  );
};

export default UserManagement;
