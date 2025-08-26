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

import { OrdersTableColumns } from "./OrdersTableColumns";
import useOrdersHook from "./useOrdersHook";

export default function OrdersContainer() {
  const {
    form,
    handleChange,
    setForm,
    resetForm,
    handleSubmit,
    orders,
    users,
    products,
    statuses,
    dialogOpen,
    setDialogOpen,
    handleDelete,
  } = useOrdersHook();

  const actionColumn = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setForm({ ...order });
                setDialogOpen(true);
              }}
            >
              Edit order details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleDelete(order.id);
              }}
            >
              Delete order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const finalColumns = [...OrdersTableColumns, actionColumn];

  return (
    <div className=" border-red-500 h-full">
      <h1 className="text-2xl font-bold">Orders management</h1>

      <DataTable
        columns={finalColumns}
        data={orders.get()}
        searchBy={"userName"}
        // ----form dialog props-----------
        dialogProps={{
          title: "orders",
          form,
          setForm,
          handleSubmit,
          handleChange,
          open: dialogOpen,
          setOpen: setDialogOpen,
          users: users.get(),
          products: products.get(),
        }}
      />
    </div>
  );
}
