import { hookstate } from "@hookstate/core";
import api from "@/lib/api";
import { generateId } from "@/lib/utils";
import type { ProductFormType } from "@/container/products/useProductsHook";

export const productState = hookstate<ProductFormType[]>([]);

export const productActions = {
  async fetchAll() {
    const data = await api.get("/products");
    productState.set(data as any);
  },

  async create(product: ProductFormType) {
    const payload = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const saved = await api.post("/products", payload);
    productState.set((prev: any) => [saved, ...prev]);
    return saved;
  },

  async update(product: ProductFormType) {
    const saved = await api.put(`/products/${product.id}`, product);
    productState.set((prev: any) =>
      prev.map((p: any) => (p.id === product.id ? saved : p))
    );
    return saved;
  },

  async delete(id: string) {
    await api.delete(`/products/${id}`);
    productState.set((prev) => prev.filter((p) => p.id !== id));
  },
};
