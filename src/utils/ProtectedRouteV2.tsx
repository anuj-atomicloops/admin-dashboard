import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/container/auth/useAuth";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function ProtectedRouteV2({ children }: any) {
  const location = useLocation();
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <Spinner variant={"default"} />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
