import { columns as baseColumns } from "@/components/common/table/columns";
import { DataTable } from "@/components/common/table/data-table";
import useUserHook from "./hook";
import AddUserForm from "./AddUserForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function UsersContainer() {
  const {
    pageTitle,
    setPageTitle,
    form,
    handleChange,
    setForm,
    handleSubmit,
    users,
    handleDelete,
  } = useUserHook();

  const actionColumn = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
            <DropdownMenuItem>Edit customer details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("del")}>
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const finalColumns = [...baseColumns, actionColumn];

  return (
    <div className="border border-red-500 h-full">
      <h1 onClick={() => setPageTitle("")} className="text-2xl font-bold">
        {pageTitle === "" ? "Users management" : "Add new user"}
      </h1>
      {pageTitle === "" ? (
        <DataTable
          setPageTitle={setPageTitle}
          columns={finalColumns}
          data={users.get()}
        />
      ) : (
        <AddUserForm
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      )}
    </div>
  );
}
