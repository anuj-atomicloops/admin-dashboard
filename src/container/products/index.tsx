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

import useProductsHook from "./useProductsHook";
import { ProductsTableColumns } from "./ProductsTableColumns";

export default function ProductsContainer() {
  const {
    form,
    processSubmit,
    handleDelete,
    handleEdit,
    products,
    dialogOpen,
    setDialogOpen,
    categories,
  } = useProductsHook();

  const actionColumn = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy Product id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                handleEdit({ ...product });
                setDialogOpen(true);
              }}
            >
              Edit product details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(product.id)}>
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const finalColumns = [...ProductsTableColumns, actionColumn];

  return (
    <div className=" border-red-500 h-full">
      <h1 className="text-2xl font-bold">Products management</h1>

      <DataTable
        columns={finalColumns}
        data={products.get()}
        searchBy={["name"]}
        // ----form dialog props-----------
        dialogProps={{
          title: "products",
          form,
          processSubmit,
          handleDelete,
          handleEdit,
          products,
          dialogOpen,
          setDialogOpen,
          categories,
        }}
      />
    </div>
  );
}
