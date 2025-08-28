import { useHookstate } from "@hookstate/core";
import { globalState } from "@/store/globalState";
import api from "@/lib/api";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ---------------- Schema ----------------
const OrderFormSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, "Please select a user"),
  productId: z.string().min(1, "Please select a product"),
  qty: z
    .number({ invalid_type_error: "Quantity is required" })
    .min(1, "Quantity must be at least 1")
    .max(5, "Maximum allowed quantity is 5"),
  status: z.enum(["completed", "pending", "shipped", "cancelled"]).optional(),
});

export type OrderFormType = z.infer<typeof OrderFormSchema>;

// ---------------- Hook ----------------
const useOrdersHook = () => {
  const form = useForm<OrderFormType>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      userId: "",
      productId: "",
      qty: 1,
      status: "completed",
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const users: any = useHookstate(globalState.users);
  const products: any = useHookstate(globalState.products);
  const orders: any = useHookstate(globalState.orders);

  const statuses = ["completed", "pending", "shipped", "cancelled"];

  // ---------------- Create / Update ----------------
  const processSubmit = async (values: OrderFormType) => {
    try {
      const selectedUser = users
        .get({ noproxy: true })
        .find((u: any) => u.id === values.userId);
      const selectedProduct = products
        .get({ noproxy: true })
        .find((p: any) => p.id === values.productId);

      if (!selectedUser) {
        toast.error("Invalid user");
        return false;
      }
      if (!selectedProduct) {
        toast.error("Invalid product");
        return false;
      }

      const totalAmount = selectedProduct?.price * values.qty;

      if (values.id) {
        // ---------- EDIT ORDER ----------
        const existingOrder = orders
          .get({ noproxy: true })
          .find((o: any) => o.id === values.id);

        if (!existingOrder) {
          toast.error("Order not found");
          return false;
        }

        // stock difference
        const qtyDiff = values.qty - existingOrder.qty;

        // --- update order ---
        const updatedOrder = {
          ...existingOrder,
          ...values,
          totalAmount,
        };
        await api.put(`/orders/${existingOrder.id}`, updatedOrder);

        orders.set((prev: any) =>
          prev.map((o: any) => (o.id === existingOrder.id ? updatedOrder : o))
        );

        // --- update stock ---
        await api.put(`/products/${selectedProduct.id}`, {
          ...selectedProduct,
          availableQuantity: selectedProduct.availableQuantity - qtyDiff,
        });
        products.set((prev: any) =>
          prev.map((p: any) =>
            p.id === selectedProduct.id
              ? {
                  ...p,
                  availableQuantity: p.availableQuantity - qtyDiff,
                }
              : p
          )
        );

        // --- update user spent ---
        const spentDiff =
          selectedProduct.price * values.qty -
          selectedProduct.price * existingOrder.qty;

        await api.put(`/users/${selectedUser.id}`, {
          ...selectedUser,
          totalSpent: (selectedUser.totalSpent || 0) + spentDiff,
          lastOrderDate: new Date().toISOString(),
        });
        users.set((prev: any) =>
          prev.map((u: any) =>
            u.id === selectedUser.id
              ? {
                  ...u,
                  totalSpent: u.totalSpent + spentDiff,
                  lastOrderDate: new Date().toISOString(),
                }
              : u
          )
        );

        toast.success("Order updated successfully");
      } else {
        // ---------- CREATE ORDER ----------
        const payload = {
          id: generateId(),
          userId: selectedUser?.id,
          userName: selectedUser?.name,
          productId: selectedProduct?.id,
          productName: selectedProduct?.name,
          qty: values.qty,
          totalAmount,
          status: values.status || "completed",
          orderDate: new Date().toISOString(),
        };

        const savedOrder = await api.post("/orders", payload);
        orders.set((prev: any) => [savedOrder, ...prev]);

        // ----------update product stock--------------
        await api.put(`/products/${selectedProduct.id}`, {
          ...selectedProduct,
          availableQuantity: selectedProduct.availableQuantity - values.qty,
        });
        products.set((prev: any) =>
          prev.map((p: any) =>
            p.id === selectedProduct.id
              ? {
                  ...p,
                  availableQuantity: p.availableQuantity - values.qty,
                }
              : p
          )
        );

        // -----------update user order stats---------
        await api.put(`/users/${selectedUser.id}`, {
          ...selectedUser,
          ordersCount: (selectedUser.ordersCount || 0) + 1,
          totalSpent: (selectedUser.totalSpent || 0) + totalAmount,
          lastOrderDate: new Date().toISOString(),
        });
        users.set((prev: any) =>
          prev.map((u: any) =>
            u.id === selectedUser.id
              ? {
                  ...u,
                  ordersCount: u.ordersCount + 1,
                  totalSpent: u.totalSpent + totalAmount,
                  lastOrderDate: new Date().toISOString(),
                }
              : u
          )
        );

        toast.success("Order placed successfully");
      }

      form.reset();
      setDialogOpen(false);
      return true;
    } catch (err) {
      console.error("Error saving order:", err);
      toast.error("Failed to save order");
      return false;
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (orderId: string) => {
    try {
      const existingOrder = orders
        .get({ noproxy: true })
        .find((o: any) => o.id === orderId);
      if (!existingOrder) return;

      const selectedUser = users
        .get({ noproxy: true })
        .find((u: any) => u.id === existingOrder.userId);
      const selectedProduct = products
        .get({ noproxy: true })
        .find((p: any) => p.id === existingOrder.productId);

      // --------------delete order-----------
      await api.delete(`/orders/${orderId}`);
      orders.set((prev: any) => prev.filter((o: any) => o.id !== orderId));

      // --------------restore product stock------------------
      await api.put(`/products/${selectedProduct.id}`, {
        ...selectedProduct,
        availableQuantity:
          selectedProduct.availableQuantity + existingOrder.qty,
      });
      products.set((prev: any) =>
        prev.map((p: any) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                availableQuantity: p.availableQuantity + existingOrder.qty,
              }
            : p
        )
      );

      //------------- update user stats--------------
      await api.put(`/users/${selectedUser.id}`, {
        ...selectedUser,
        ordersCount: (selectedUser.ordersCount || 1) - 1,
        totalSpent: (selectedUser.totalSpent || 0) - existingOrder.totalAmount,
      });
      users.set((prev: any) =>
        prev.map((u: any) =>
          u.id === selectedUser.id
            ? {
                ...u,
                ordersCount: u.ordersCount - 1,
                totalSpent: u.totalSpent - existingOrder.totalAmount,
              }
            : u
        )
      );

      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order");
    }
  };

  // ---------------- Edit ----------------
  const handleEdit = (product: any) => {
    form.reset({
      ...product,
    });
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
