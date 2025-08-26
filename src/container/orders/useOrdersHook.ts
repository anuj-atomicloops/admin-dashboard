import useForm from "@/hooks/useForm";
import { useHookstate } from "@hookstate/core";
import { globalState } from "@/store/globalState";
import api from "@/lib/api";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { useState } from "react";

const useOrdersHook = () => {
  const { form, handleChange, setForm, resetForm }: any = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);

  // global states
  const users: any = useHookstate(globalState.users);
  const products: any = useHookstate(globalState.products);
  const orders: any = useHookstate(globalState.orders);

  const statuses = ["completed", "pending", "shipped", "cancelled"];

  // --- Validation ---
  const validateForm = () => {
    if (!form.userId) {
      toast.error("Please select a user");
      return null;
    }

    if (!form.productId) {
      toast.error("Please select a product");
      return null;
    }

    const selectedProduct = products
      .get({ noproxy: true })
      .find((p: any) => p.id === form.productId);
    if (!selectedProduct) {
      toast.error("Invalid product");
      return null;
    }

    const qty = Number(form.qty);
    if (!qty || qty <= 0) {
      toast.error("Quantity must be at least 1");
      return null;
    }

    if (qty > 5) {
      toast.error("Maximum allowed quantity is 5");
      return null;
    }

    // ✅ allow editing even if new qty > current available, as long as stock + oldQty covers it
    if (!form.id && qty > selectedProduct.availableQuantity) {
      toast.error(
        `Only ${selectedProduct.availableQuantity} items available in stock`
      );
      return null;
    }

    return {
      ...form,
      qty,
    };
  };

  // --- Handle Submit (Create / Update Order) ---
  const handleSubmit = async () => {
    const validated = validateForm();
    if (!validated) return false;

    const selectedUser = users
      .get({ noproxy: true })
      .find((u: any) => u.id === validated.userId);
    const selectedProduct = products
      .get({ noproxy: true })
      .find((p: any) => p.id === validated.productId);

    const totalAmount = selectedProduct?.price * validated.qty;

    try {
      if (form?.id) {
        // ---------- EDIT ORDER ----------
        const existingOrder = orders
          .get({ noproxy: true })
          .find((o: any) => o.id === form.id);

        if (!existingOrder) {
          toast.error("Order not found");
          return false;
        }

        // stock difference
        const qtyDiff = validated.qty - existingOrder.qty;

        // --- update order ---
        const updatedOrder = {
          ...existingOrder,
          ...validated,
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
          selectedProduct.price * validated.qty -
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
          qty: validated.qty,
          totalAmount,
          status: validated.status || "completed",
          orderDate: new Date().toISOString(),
        };

        const savedOrder = await api.post("/orders", payload);
        orders.set((prev: any) => [savedOrder, ...prev]);

        // update product stock
        await api.put(`/products/${selectedProduct.id}`, {
          ...selectedProduct,
          availableQuantity: selectedProduct.availableQuantity - validated.qty,
        });
        products.set((prev: any) =>
          prev.map((p: any) =>
            p.id === selectedProduct.id
              ? {
                  ...p,
                  availableQuantity: p.availableQuantity - validated.qty,
                }
              : p
          )
        );

        // update user order stats
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

      resetForm();
      return true;
    } catch (err) {
      console.error("Error saving order:", err);
      toast.error("Failed to save order");
      return false;
    }
  };

  // --- Handle Delete ---
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

      // delete order
      await api.delete(`/orders/${orderId}`);
      orders.set((prev: any) => prev.filter((o: any) => o.id !== orderId));

      // restore product stock
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

      // update user stats
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

  return {
    form,
    handleChange,
    setForm,
    resetForm,
    handleSubmit,
    handleDelete,
    orders,
    users,
    products,
    statuses,
    dialogOpen,
    setDialogOpen,
  };
};

export default useOrdersHook;
