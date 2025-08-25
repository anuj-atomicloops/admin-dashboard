import useForm from "@/hooks/useForm";

import { useHookstate } from "@hookstate/core";
import { globalState } from "@/store/globalState";
import api from "@/lib/api";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { useState } from "react";

const useUserHook = () => {
  const { form, handleChange, setForm, resetForm } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const users = useHookstate(globalState.users);

  // --- Validation helper ---
  const validateForm = () => {
    // ----------------Name at least 3 chars
    if (!form.name || form.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters long");
      return null;
    }

    // ------------Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return null;
    }

    let phone = form.phone || "";

    // -------- exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return null;
    }

    // ---------------add 91 before saving
    phone = "91" + phone;

    if (!form.gender) {
      toast.error("Please select gender (Male or Female)");
      return null;
    }

    if (!form.status) {
      toast.error("Please select a status (Active or Banned)");
      return null;
    }

    // ------------ at least 10 chars
    if (!form.address || form.address.trim().length < 10) {
      toast.error("Address must be at least 10 characters long");
      return null;
    }

    return {
      ...form,
      phone,
    };
  };

  const handleSubmit = async () => {
    const validated = validateForm();
    if (!validated) return false;

    const isEdit = !!validated.id;

    //--------- 91 prefix only once
    let phoneWithPrefix = validated.phone.startsWith("91")
      ? validated.phone
      : "91" + validated.phone;

    const payload = {
      ...validated,
      phone: phoneWithPrefix,
      ordersCount: validated.ordersCount ?? 0,
      totalSpent: validated.totalSpent ?? 0,
      lastOrderDate: validated.lastOrderDate || null,
      createdAt: isEdit ? validated.createdAt : new Date().toISOString(),
      lastLogin: validated.lastLogin || null,
    };

    try {
      let savedUser;
      if (isEdit) {
        savedUser = await api.put(`/users/${validated.id}`, payload);
        users.set((prev) =>
          prev.map((u: any) => (u.id === validated.id ? savedUser : u))
        );
        toast.success("User updated successfully");
      } else {
        payload.id = generateId();
        savedUser = await api.post("/users", payload);
        users.set((prev) => [savedUser, ...prev]);
        toast.success("User added successfully");
      }

      resetForm();
      return true;
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(isEdit ? "Failed to update user" : "Failed to add user");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      users.set((prev) => prev.filter((user: any) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    }
  };

  return {
    form,
    handleDelete,
    handleChange,
    setForm,
    resetForm,
    handleSubmit,
    users,
    dialogOpen,
    setDialogOpen,
  };
};

export default useUserHook;
