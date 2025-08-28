import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddUserForm from "@/container/users/AddUserForm";
import AddProductsrForm from "@/container/products/AddProductsrForm";
import AddOrdersForm from "@/container/orders/AddOrdersForm";
import useOrdersHook from "@/container/orders/useOrdersHook";

export function FormDialog({
  title,
  form,
  processSubmit,
  dialogOpen,
  setDialogOpen,

  // products
  categories,
  // orders
  statuses,
  users,
  products,
}: any) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add new {title}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {form?.id ? "Edit" : "Add new"} {title}
          </DialogTitle>
          <DialogDescription>
            {form?.id
              ? `Update details for this ${title}.`
              : `Fill in the details below to create a new ${title}.`}
          </DialogDescription>
        </DialogHeader>

        {title === "user" ? (
          <AddUserForm form={form} processSubmit={processSubmit} />
        ) : title === "products" ? (
          <AddProductsrForm
            form={form}
            categories={categories}
            processSubmit={processSubmit}
          />
        ) : title === "orders" ? (
          <AddOrdersForm
            form={form}
            users={users}
            products={products}
            processSubmit={processSubmit}
            statuses={statuses}
          />
        ) : (
          <h1>Add a form</h1>
        )}
      </DialogContent>
    </Dialog>
  );
}
