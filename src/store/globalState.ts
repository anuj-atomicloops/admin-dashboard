import { hookstate } from '@hookstate/core';

export const globalState = hookstate({
  users: [],
  products: [],
  orders: [],
});
