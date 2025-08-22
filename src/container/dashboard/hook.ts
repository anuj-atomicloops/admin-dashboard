import api from "@/lib/api";
import { globalState } from "@/store/globalState";
import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";

const useDashboardHook = () => {
  const users = useHookstate(globalState.users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.get("/users");
        users.set(data.reverse());
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return { users };
};

export default useDashboardHook;
