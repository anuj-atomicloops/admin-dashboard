import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { orderState, orderActions } from "@/store/orderState";
import {  useHookstate } from "@hookstate/core";
import { userActions, userState } from "@/store/userState";
import { productActions, productState } from "@/store/productState";

// ---------------- Schema ----------------
const OrderFormSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, "Please select a user"),
  productId: z.string().min(1, "Please select a product"),
  qty: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(5, "Maximum allowed quantity is 5"),
  status: z.enum(["completed", "pending", "shipped", "cancelled"]).optional(),
});

export type OrderFormType = z.infer<typeof OrderFormSchema>;

// ---------------- Hook ----------------
const useOrdersHook = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const orders = useHookstate(orderState);
  const users = useHookstate(userState);
  const products = useHookstate(productState);

  const statuses = ["completed", "pending", "shipped", "cancelled"];

  const form = useForm<OrderFormType>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      userId: "",
      productId: "",
      qty: 1,
      status: "completed",
    },
  });

  // ---------------fetch initial states
  useEffect(() => {
    orderActions.fetchAll().catch(() => toast.error("Failed to fetch orders"));
    userActions.fetchAll().catch(() => toast.error("Failed to fetch users"));
    productActions
      .fetchAll()
      .catch(() => toast.error("Failed to fetch products"));
  }, []);

  const processSubmit = async (data: OrderFormType) => {
    try {
      if (data.id) {
        await orderActions.update(data);
        toast.success("Order updated successfully");
      } else {
        await orderActions.create(data);
        toast.success("Order placed successfully");
      }
      form.reset();
      setDialogOpen(false);
    } catch (err) {
      toast.error(
        data.id ? "Failed to update order" : "Failed to create order"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await orderActions.delete(id);
      toast.success("Order deleted successfully");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const handleEdit = (order: OrderFormType) => {
    form.reset(order);
    setDialogOpen(true);
  };

  return {
    form,
    processSubmit,
    handleDelete,
    handleEdit,
    orders,
    users,
    products,
    statuses,
    dialogOpen,
    setDialogOpen,
  };
};

export default useOrdersHook;
