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
    pageTitle,
    setPageTitle,
    form,
    handleChange,
    setForm,
    handleSubmit,
    products,
    handleDelete,
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
            <DropdownMenuItem>Edit customer details</DropdownMenuItem>
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
      <h1 onClick={() => setPageTitle("")} className="text-2xl font-bold">
        {pageTitle === "" ? "Products management" : "Add new Product"}
      </h1>
      {pageTitle === "" ? (
        <DataTable
          setPageTitle={setPageTitle}
          columns={finalColumns}
          data={products.get()}
          searchBy={"name"}
        />
      ) : null}
    </div>
  );
}
