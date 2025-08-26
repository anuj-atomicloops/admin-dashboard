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

export function FormDialog({
  title,
  form,
  setForm,
  handleSubmit,
  handleChange,
  open,
  setOpen,
  categories,
  users,
  products,
}: any) {
  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <AddUserForm
            form={form}
            setForm={setForm}
            handleSubmit={handleFormSubmit}
            handleChange={handleChange}
          />
        ) : title === "products" ? (
          <AddProductsrForm
            form={form}
            categories={categories}
            setForm={setForm}
            handleSubmit={handleFormSubmit}
            handleChange={handleChange}
          />
        ) : title === "orders" ? (
          <AddOrdersForm
            form={form}
            users={users}
            products={products}
            setForm={setForm}
            handleSubmit={handleFormSubmit}
            handleChange={handleChange}
          />
        ) : (
          <h1>Add a form</h1>
        )}
      </DialogContent>
    </Dialog>
  );
}
