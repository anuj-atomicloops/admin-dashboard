import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

import Products from "./pages/Products";
import { ThemeProvider } from "./providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";
import api from "./lib/api";
import { globalState } from "./store/globalState";
import Orders from "./pages/Orders";
const queryClient = new QueryClient();
function App() {
  const store = useHookstate(globalState);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.get("/users");
        store.users.set(data.reverse());
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    const fetchProducts = async () => {
      try {
        const data = await api.get("/products");
        store.products.set(data.reverse());
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchOrders = async () => {
      try {
        const data = await api.get("/orders");
        store.orders.set(data.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route path="/" element={<DashboardLayout />}>
                {/* -----------main outlets-------------- */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
