import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { userState, userActions } from "@/store/userState";
import { useHookstate } from "@hookstate/core";

const UserFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits."),
  gender: z.string().min(1, "Please select a gender"),
  status: z.string().min(1, "Please select a status"),
  address: z.string().min(5, "Address must be at least 5 characters long."),
  ordersCount: z.number().optional(),
  totalSpent: z.number().optional(),
  lastOrderDate: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  lastLogin: z.string().nullable().optional(),
});

export type UserFormData = z.infer<typeof UserFormSchema>;

const useUserHook = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const users = useHookstate(userState);

  console.log(users, "users in hook");

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

  useEffect(() => {
    userActions.fetchAll().catch(() => toast.error("Failed to fetch users"));
  }, []);

  const processSubmit = async (data: UserFormData) => {
    try {
      if (data.id) {
        await userActions.update(data);
        toast.success("User updated successfully");
      } else {
        await userActions.create(data);
        toast.success("User added successfully");
      }
      form.reset();
      setDialogOpen(false);
    } catch (err) {
      toast.error(data.id ? "Failed to update user" : "Failed to add user");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userActions.delete(id);
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user: UserFormData) => {
    const phoneWithoutPrefix = user.phone?.startsWith("91")
      ? user.phone.slice(2)
      : user.phone;

    form.reset({ ...user, phone: phoneWithoutPrefix });
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
