"use client";

import * as React from "react";

import { type ColumnDef } from "@tanstack/react-table";

import { formatDate } from "~/lib/utils";

import {
  type DataTableSearchableColumn,
  type DataTableFilterableColumn,
} from "~/types/data-table";

import { DataTableColumnHeader } from "../data-table-column-header";
import { type Plan, type User } from "@prisma/client";

export const searchableColumns: DataTableSearchableColumn<
  User & { plan: Plan | null }
>[] = [
  {
    id: "email",
    placeholder: "Filter email...",
  },
];

export const filterableColumns: DataTableFilterableColumn<
  User & { plan: Plan | null }
>[] = [
  {
    id: "role",
    title: "Role",
    options: [
      {
        label: "User",
        value: "USER",
      },
      {
        label: "Super Admin",
        value: "SUPER_ADMIN",
      },
    ],
  },
  {
    id: "planId",
    title: "Plan",
    options: [
      {
        label: "Default",
        value: "1",
      },
      {
        label: "Monthly",
        value: "2",
      },
      {
        label: "Yearly",
        value: "4",
      },
    ],
  },
];

export function getColumns(): ColumnDef<User & { plan: Plan | null }>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      enableSorting: true,
      enableHiding: true,
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
      enableColumnFilter: false,
    },
    {
      accessorKey: "planId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Plan" />
      ),
      cell: ({ row }) => {
        const plan = row.original.plan;
        return <div>{plan?.name}</div>;
      },
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
      enableColumnFilter: false,
      enableSorting: true,
    },
  ];
}
