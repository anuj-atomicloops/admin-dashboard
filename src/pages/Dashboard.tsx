import DashboardContainer from "@/container/dashboard";
import api from "@/lib/api";
import { globalState } from "@/store/globalState";
import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";

export default function Dashborad() {
  const store = useHookstate(globalState);

  const fetchData = async (endpoint: string, setter: any) => {
    try {
      const data = await api.get(endpoint);
      console.log(data, "dataaaaa");
      setter(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };
  
  useEffect(() => {
    fetchData("/users", store.users.set);
    fetchData("/products", store.products.set);
    fetchData("/orders", store.orders.set);
  }, []);

  return <DashboardContainer />;
}
