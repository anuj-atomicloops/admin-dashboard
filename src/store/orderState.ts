import { hookstate } from "@hookstate/core";
import api from "@/lib/api";
import { generateId } from "@/lib/utils";
import type { OrderFormType } from "@/container/orders/useOrdersHook";
import { userState } from "./userState";
import { productState } from "./productState";

// ----------------- Store -----------------
export const orderState = hookstate<any[]>([]);

// ----------------- Actions -----------------
export const orderActions = {
  async fetchAll() {
    const data = await api.get("/orders");
    orderState.set(data as any);
  },

  async create(order: OrderFormType) {
    const users = userState.get({ noproxy: true });
    const products = productState.get({ noproxy: true });

    const selectedUser = users.find((u: any) => u.id === order.userId);
    const selectedProduct = products.find((p: any) => p.id === order.productId);

    if (!selectedUser || !selectedProduct) throw new Error("Invalid data");

    const totalAmount = selectedProduct.price * order.qty;

    const payload = {
      id: generateId(),
      userId: selectedUser.id,
      userName: selectedUser.name,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      qty: order.qty,
      totalAmount,
      status: order.status || "completed",
      orderDate: new Date().toISOString(),
    };

    const saved = await api.post("/orders", payload);
    orderState.set((prev: any) => [saved, ...prev]);

    //---------------------- update product stock
    await api.put(`/products/${selectedProduct.id}`, {
      ...selectedProduct,
      availableQuantity: selectedProduct.availableQuantity - order.qty,
    });
    productState.set((prev: any) =>
      prev.map((p: any) =>
        p.id === selectedProduct.id
          ? { ...p, availableQuantity: p.availableQuantity - order.qty }
          : p
      )
    );

    // ------------------------update user stats
    await api.put(`/users/${selectedUser.id}`, {
      ...selectedUser,
      ordersCount: (selectedUser.ordersCount || 0) + 1,
      totalSpent: (selectedUser.totalSpent || 0) + totalAmount,
      lastOrderDate: new Date().toISOString(),
    });
    userState.set((prev: any) =>
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

    return saved;
  },

  async update(order: OrderFormType) {
    const users = userState.get({ noproxy: true });
    const products = productState.get({ noproxy: true });
    const orders = orderState.get({ noproxy: true });

    const existingOrder = orders.find((o: any) => o.id === order.id);
    if (!existingOrder) throw new Error("Order not found");

    const selectedUser = users.find((u: any) => u.id === order.userId);
    const selectedProduct = products.find((p: any) => p.id === order.productId);

    if (!selectedUser || !selectedProduct) throw new Error("Invalid data");

    const totalAmount = selectedProduct.price * order.qty;
    const qtyDiff = order.qty - existingOrder.qty;
    const spentDiff =
      selectedProduct.price * order.qty -
      selectedProduct.price * existingOrder.qty;

    const updatedOrder = {
      ...existingOrder,
      ...order,
      totalAmount,
    };

    const saved = await api.put(`/orders/${order.id}`, updatedOrder);
    orderState.set((prev: any) =>
      prev.map((o: any) => (o.id === order.id ? saved : o))
    );

    // update stock
    await api.put(`/products/${selectedProduct.id}`, {
      ...selectedProduct,
      availableQuantity: selectedProduct.availableQuantity - qtyDiff,
    });
    productState.set((prev: any) =>
      prev.map((p: any) =>
        p.id === selectedProduct.id
          ? { ...p, availableQuantity: p.availableQuantity - qtyDiff }
          : p
      )
    );

    // ----------------update user stats
    await api.put(`/users/${selectedUser.id}`, {
      ...selectedUser,
      totalSpent: (selectedUser.totalSpent || 0) + spentDiff,
      lastOrderDate: new Date().toISOString(),
    });
    userState.set((prev: any) =>
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

    return saved;
  },

  async delete(orderId: string) {
    const orders = orderState.get({ noproxy: true });
    const users = userState.get({ noproxy: true });
    const products = productState.get({ noproxy: true });

    const existingOrder = orders.find((o: any) => o.id === orderId);
    if (!existingOrder) throw new Error("Order not found");

    const selectedUser = users.find((u: any) => u.id === existingOrder.userId);
    const selectedProduct = products.find(
      (p: any) => p.id === existingOrder.productId
    );

    // -------------------delete order
    await api.delete(`/orders/${orderId}`);
    orderState.set((prev: any) => prev.filter((o: any) => o.id !== orderId));

    // -------------restore stock
    await api.put(`/products/${selectedProduct?.id}`, {
      ...selectedProduct,
      availableQuantity: selectedProduct?.availableQuantity + existingOrder.qty,
    });
    productState.set((prev: any) =>
      prev.map((p: any) =>
        p.id === selectedProduct?.id
          ? {
              ...p,
              availableQuantity: p.availableQuantity + existingOrder.qty,
            }
          : p
      )
    );

    // -----------------update user stats
    await api.put(`/users/${selectedUser?.id}`, {
      ...selectedUser,
      ordersCount: (selectedUser?.ordersCount || 1) - 1,
      totalSpent: (selectedUser?.totalSpent || 0) - existingOrder.totalAmount,
    });
    userState.set((prev: any) =>
      prev.map((u: any) =>
        u.id === selectedUser?.id
          ? {
              ...u,
              ordersCount: u.ordersCount - 1,
              totalSpent: u.totalSpent - existingOrder.totalAmount,
            }
          : u
      )
    );
  },
};
