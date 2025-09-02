import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { productState, productActions } from "@/store/productState";
import { useHookstate } from "@hookstate/core";

// ---------------- Schema ----------------
const ProductFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Product Name must be at least 3 characters long."),
  category: z.string().min(1, "Please enter a valid category."),
  description: z.string().min(4, "Add a product description."),
  price: z.number().positive("Price must be greater than 0."),
  availableQuantity: z
    .number()
    .int("Quantity must be an integer.")
    .min(0, "Quantity cannot be negative."),
  createdAt: z.string().optional(),
});

export type ProductFormType = z.infer<typeof ProductFormSchema>;

// ---------------- Hook ----------------
const useProductHook = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const products = useHookstate(productState);

  const categories = ["Electronics", "Fashion", "Books", "Home", "Sports"];

  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      availableQuantity: 0,
    },
  });

  //--------- Fetch products on mount
  useEffect(() => {
    productActions
      .fetchAll()
      .catch(() => toast.error("Failed to fetch products"));
  }, []);

  // ---------------- Submit ----------------
  const processSubmit = async (data: ProductFormType) => {
    try {
      if (data.id) {
        await productActions.update(data);
        toast.success("Product updated successfully");
      } else {
        await productActions.create(data);
        toast.success("Product added successfully");
      }

      form.reset();
      setDialogOpen(false);
    } catch (err) {
      toast.error(
        data.id ? "Failed to update product" : "Failed to add product"
      );
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id: string) => {
    try {
      await productActions.delete(id);
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  // ---------------- Edit ----------------
  const handleEdit = (product: ProductFormType) => {
    form.reset({
      ...product,
      price: Number(product.price ?? 0),
      availableQuantity: Number(product.availableQuantity ?? 0),
    });
    setDialogOpen(true);
  };

  return {
    form,
    processSubmit,
    handleDelete,
    handleEdit,
    products,
    dialogOpen,
    setDialogOpen,
    categories,
  };
};

export default useProductHook;
