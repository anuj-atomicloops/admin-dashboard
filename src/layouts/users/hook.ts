import useForm from "@/hooks/useForm";
import { useEffect, useState } from "react";
import { useHookstate } from "@hookstate/core";
import { globalState } from "@/store/globalState";
import api from "@/lib/api";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";

const useUserHook = () => {
  const [pageTitle, setPageTitle] = useState("");
  const { form, handleChange, setForm, resetForm } = useForm();

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

  const handleSubmit = async () => {
    console.log("Final form data (raw):", form);

    const payload = {
      id: generateId(),
      name: form.name || "",
      email: form.email || "",
      phone: form.phone || "",
      address: form.address || "",
      role: form.role || "customer",
      status: form.status || "active",
      ordersCount: form.ordersCount ?? 0,
      totalSpent: form.totalSpent ?? 0,
      lastOrderDate: form.lastOrderDate || null,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    // console.log("Payload ", payload);

    try {
      const newUser = await api.post("/users", payload);
      users.set((prev) => [newUser, ...prev]);
      resetForm();
      setPageTitle("");
      toast.success("User added successfully");
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

   const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      users.set((prev) => prev.filter((user: any) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user ");
    }
  };

  return {
    pageTitle,
    setPageTitle,
    form,
    handleDelete,
    handleChange,
    setForm,
    resetForm,
    handleSubmit,
    users,
  };
};

export default useUserHook;
