"use client";
import React from "react";
import { UserTableProvider } from "~/components/patterns/data-table/data-table-provider";
import { UserTable } from "~/components/patterns/data-table/user-table/user-table";

const UserManagement = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl">User Management</h1>

      <UserTableProvider>
        <UserTable />
      </UserTableProvider>
    </div>
  );
};

export default UserManagement;
