import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookstate } from "@hookstate/core";
import { toast } from "sonner";
import { z } from "zod";
import { globalState } from "@/store/globalState";
import api from "@/lib/api";
import { generateId } from "@/lib/utils";

const UserFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  status: z.string().min(1, { message: "Please select a status" }),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." }),
  ordersCount: z.number().optional(),
  totalSpent: z.number().optional(),
  lastOrderDate: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  lastLogin: z.string().nullable().optional(),
});

export type UserFormData = z.infer<typeof UserFormSchema>;

const useUserHook = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const users = useHookstate(globalState.users);

  // -----------------------------------------------------
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      status: "",
    },
  });

  //  --------------------handle submit----------------------
  const processSubmit = async (data: z.infer<typeof UserFormSchema>) => {
    const isEdit = !!data.id;

    const payload = {
      ...data,
      phone: `91${data.phone}`,
      ordersCount: data.ordersCount ?? 0,
      totalSpent: data.totalSpent ?? 0,
      lastOrderDate: data.lastOrderDate || null,
      createdAt: isEdit ? data.createdAt : new Date().toISOString(),
      lastLogin: data.lastLogin || null,
    };

    try {
      let savedUser: UserFormData;
      if (isEdit) {
        savedUser = await api.put(`/users/${data.id}`, payload);
        users.set((prev: any) =>
          prev.map((u: any) => (u.id === data.id ? savedUser : u))
        );
        toast.success("User updated successfully");
      } else {
        payload.id = generateId();
        savedUser = await api.post("/users", payload);
        users.set((prev) => [savedUser, ...prev]);
        toast.success("User added successfully");
      }

      form.reset();
      setDialogOpen(false);
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

  //  ---------------handle edit----------------------
  const handleEdit = (user: any) => {
    // --------Remove the '91' prefix for the form field----------
    const phoneWithoutPrefix = user.phone?.startsWith("91")
      ? user.phone.slice(2)
      : user.phone;

    form.reset({
      ...user,
      phone: phoneWithoutPrefix,
    });
    setDialogOpen(true);
  };

  return {
    form,
    processSubmit,
    handleDelete,
    handleEdit,
    users,
    dialogOpen,
    setDialogOpen,
  };
};

export default useUserHook;
