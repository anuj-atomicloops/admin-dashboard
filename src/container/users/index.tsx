import { UsersTableColumns } from "@/container/users/UsersTableColumns";
import { DataTable } from "@/layouts/data-table";
import useUserHook from "./useUserHook";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function UsersContainer() {
  const { form, handleChange, setForm, handleSubmit, users, handleDelete,dialogOpen, setDialogOpen } =
    useUserHook();
  

  const actionColumn = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copy customer email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const formattedPhone = user.phone.startsWith("91")
                  ? user.phone.slice(2) //---------> remove "91" prefix
                  : user.phone;

                setForm({ ...user, phone: formattedPhone });
                setDialogOpen(true);
              }}
            >
              Edit customer details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user.id)}>
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const finalColumns = [...UsersTableColumns, actionColumn];

  return (
    <div className=" border-red-500 h-full">
      <h1 className="text-2xl font-bold">Users management</h1>

      <DataTable
        columns={finalColumns}
        data={users.get()}
        searchBy={"email"}
        // ----form dialog props-----------
        dialogProps={{
          title: "user",
          form,
          setForm,
          handleSubmit,
          handleChange,
          open: dialogOpen,
          setOpen: setDialogOpen,
        }}
      />
    </div>
  );
}
