import useForm from "@/hooks/useForm";
import { useHookstate } from "@hookstate/core";
import { globalState } from "@/store/globalState";
import api from "@/lib/api";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { useState } from "react";

const useProductHook = () => {
  const { form, handleChange, setForm, resetForm } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const products = useHookstate(globalState.products);
  const categories = ["Electronics", "Fashion", "Books", "Home", "Sports"];

  // --- Validation helper ---
  const validateForm = () => {
    if (!form.name || form.name.trim().length < 3) {
      toast.error("Product name must be at least 3 characters long");
      return null;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return null;
    }

    if (!form.description || form.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long");
      return null;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Price must be greater than 0");
      return null;
    }

    if (
      form.availableQuantity === undefined ||
      form.availableQuantity === null ||
      Number(form.availableQuantity) < 0
    ) {
      toast.error("Available Quantity must be 0 or more");
      return null;
    }

    return {
      ...form,
      price: Number(form.price),
      availableQuantity: Number(form.availableQuantity),
    };
  };

  const handleSubmit = async () => {
    const validated = validateForm();
    if (!validated) return false;

    const isEdit = !!validated.id;

    const payload = {
      ...validated,
      salesReport: validated.salesReport || [],
      createdAt: isEdit ? validated.createdAt : new Date().toISOString(),
    };

    try {
      let savedProduct;
      if (isEdit) {
        savedProduct = await api.put(`/products/${validated.id}`, payload);
        products.set((prev) =>
          prev.map((p: any) => (p.id === validated.id ? savedProduct : p))
        );
        toast.success("Product updated successfully");
      } else {
        payload.id = generateId();
        savedProduct = await api.post("/products", payload);
        products.set((prev) => [savedProduct, ...prev]);
        toast.success("Product added successfully");
      }

      resetForm();
      return true;
    } catch (err) {
      console.error("Error submitting product:", err);
      toast.error(
        isEdit ? "Failed to update product" : "Failed to add product"
      );
      return false;
    }
  };

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

  return {
    form,
    handleDelete,
    handleChange,
    setForm,
    resetForm,
    handleSubmit,
    products,
    dialogOpen,
    setDialogOpen,
    categories
  };
};

export default useProductHook;
