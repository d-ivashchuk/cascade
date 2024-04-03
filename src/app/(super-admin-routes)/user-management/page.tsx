"use client";
import React from "react";
import { UserTableProvider } from "~/components/patterns/data-table/data-table-provider";
import { UserTable } from "~/components/patterns/data-table/user-table/user-table";
import { searchParamsSchema } from "~/components/patterns/data-table/validations";

import { type SearchParams } from "~/types/data-table";

export interface UserManagementPageProps {
  searchParams: SearchParams;
}

const UserManagement = ({ searchParams }: UserManagementPageProps) => {
  const search = searchParamsSchema.parse(searchParams);

  return (
    <div>
      <h1 className="mb-4 text-2xl">User Management</h1>

      <UserTableProvider>
        <UserTable search={search} />
      </UserTableProvider>
    </div>
  );
};

export default UserManagement;
