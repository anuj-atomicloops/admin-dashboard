import { hookstate } from "@hookstate/core";

export const globalState = hookstate({
  users: [] as any[],
  products: [] as any[],
  orders: [] as any[],
});
