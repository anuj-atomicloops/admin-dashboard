import { hookstate } from "@hookstate/core";
import api from "@/lib/api";
import { generateId } from "@/lib/utils";
import type { UserFormData } from "@/container/users/useUserHook";

export const userState = hookstate<UserFormData[]>([]);

export const userActions = {
  async fetchAll() {
    const data = await api.get("/users");
    userState.set(data as any);
  },

  async create(user: UserFormData) {
    const payload = {
      ...user,
      id: generateId(),
      phone: `91${user.phone}`,
      ordersCount: user.ordersCount ?? 0,
      totalSpent: user.totalSpent ?? 0,
      lastOrderDate: user.lastOrderDate || null,
      createdAt: new Date().toISOString(),
      lastLogin: user.lastLogin || null,
    };
    const saved = await api.post("/users", payload);
    userState.set((prev: any) => [saved, ...prev]);
    return saved;
  },

  async update(user: UserFormData) {
    console.log(user, "update user payload");

    const updatedUser = {
      ...user,
      phone: user.phone.startsWith("91") ? user.phone : `91${user.phone}`,
    };

    const saved = await api.put(`/users/${user.id}`, updatedUser);
    userState.set((prev: any) =>
      prev.map((u: any) => (u.id === user.id ? saved : u))
    );
    return saved;
  },

  async delete(id: string) {
    await api.delete(`/users/${id}`);
    userState.set((prev) => prev.filter((u) => u.id !== id));
  },
};
