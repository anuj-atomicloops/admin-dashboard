import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookstate } from "@hookstate/core";
import { toast } from "sonner";
import { z } from "zod";

import { globalState } from "@/store/globalState";
import api from "@/lib/api";
import { generateId } from "@/lib/utils";

// ---------------- Schema ----------------
const ProductFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Product Name must be at least 3 characters long." }),
  category: z.string().min(1, { message: "Please enter a valid category." }),
  description: z.string().min(4, { message: "Add a product description." }),
  price: z
    .number({ invalid_type_error: "Price must be a number." })
    .positive({ message: "Price must be greater than 0." }),
  availableQuantity: z
    .number({ invalid_type_error: "Quantity must be a number." })
    .int({ message: "Quantity must be an integer." })
    .min(0, { message: "Quantity cannot be negative." }),
  createdAt: z.string().optional(),
});

export type ProductFormType = z.infer<typeof ProductFormSchema>;

// ---------------- Hook ----------------
const useProductHook = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const products = useHookstate(globalState.products);

  const categories = ["Electronics", "Fashion", "Books", "Home", "Sports"];

  // react-hook-form + zod
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

  // ---------------- Submit ----------------
  const processSubmit = async (data: ProductFormType) => {
    const isEdit = !!data.id;

    const payload = {
      ...data,
      createdAt: isEdit ? data.createdAt : new Date().toISOString(),
    };

    try {
      let savedProduct;
      if (isEdit) {
        savedProduct = await api.put(`/products/${data.id}`, payload);
        products.set((prev: any) =>
          prev.map((p: any) => (p.id === data.id ? savedProduct : p))
        );
        toast.success("Product updated successfully");
        
      } else {
        payload.id = generateId();
        savedProduct = await api.post("/products", payload);
        products.set((prev: any) => [savedProduct, ...prev]);
        toast.success("Product added successfully");
      }

      form.reset();
      setDialogOpen(false);
      return true;
    } catch (err) {
      console.error("Error submitting product:", err);
      toast.error(
        isEdit ? "Failed to update product" : "Failed to add product"
      );
      return false;
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      products.set((prev) => prev.filter((p: any) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  // ---------------- Edit ----------------
  const handleEdit = (product: any) => {
    // reset form with current product values
    form.reset({
      ...product,
      price:
        typeof product.price === "number"
          ? product.price
          : Number(product.price ?? 0),
      availableQuantity:
        typeof product.availableQuantity === "number"
          ? product.availableQuantity
          : Number(product.availableQuantity ?? 0),
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
