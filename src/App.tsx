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
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ThemeProvider } from "./providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import AuthProvider from "./contexts/AuthProvider/AuthProvider";
import ProtectedRouteV2 from "./utils/ProtectedRouteV2";
import { useAuth } from "./container/auth/useAuth";
import { Spinner } from "./components/ui/shadcn-io/spinner";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen w-full justify-center items-center flex">
        <Spinner variant={"default"} />
      </div>
    );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* -------------only show if NOT logged in------------ */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" /> : <Signup />}
      />

      {/*---------------- protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRouteV2>
            <DashboardLayout />
          </ProtectedRouteV2>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
