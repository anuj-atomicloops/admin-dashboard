import { UsersTableColumns } from "@/container/users/UsersTableColumns";
import { DataTable } from "@/layouts/data-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import useUserHook from "./useUserHook";

export default function UsersContainer() {
  const {
    form,
    handleEdit,
    processSubmit,
    users,
    handleDelete,
    dialogOpen,
    setDialogOpen,
  } = useUserHook();

  console.log(users, "all users");

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

                handleEdit({ ...user, phone: formattedPhone });
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
        searchBy={["email", "phone", "name", "gender"]}
        // ----form dialog props-----------
        dialogProps={{
          title: "user",
          form,
          handleEdit,
          processSubmit,
          dialogOpen,
          setDialogOpen,
        }}
      />
    </div>
  );
}
