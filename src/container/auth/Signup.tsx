import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    image: z.string().url("Select an avatar"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const avatarOptions = [
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671140.jpg?t=st=1756550106~exp=1756553706~hmac=149ec0f1bb1356131858d79ac8424da485da3e4b1a11acec0a6cd2f3e4bbcd3e",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671159.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmORkQn8AqYprKMWBbtqrcjf7pvF9vHHaGgg&s",
];

export default function SignupContainer() {
  const { signup, authLoading }: any = useAuth();
  const navigate = useNavigate();

  // console.log(authLoading, "loadinngg")

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: any) => {
    const { name, email, image, password } = values;
    const { success, message } = await signup({ name, email, image, password });
    if (success) {
      navigate("/dashboard");
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen h-auto py-4">
      <div className="border lg:w-[30%] md:w-[50%] p-6 rounded-xl shadow-md ">
        <h2 className="text-2xl font-bold mb-6 text-center ">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ---------------Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Steve Rogers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* -----------Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------Profile Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose an Avatar</FormLabel>
                  <FormControl>
                    <div className="flex gap-3 flex-wrap">
                      {avatarOptions.map((url) => (
                        <img
                          key={url}
                          src={url}
                          alt="avatar"
                          onClick={() => field.onChange(url)}
                          className={`h-12 w-12 rounded-full cursor-pointer border-3 ${
                            field.value === url
                              ? "border-yellow-500"
                              : "border-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={authLoading} type="submit" className="w-full">
              Sign Up {authLoading && <Spinner />}
            </Button>
          </form>
        </Form>

        {/* 🔹 Login link */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Already an admin?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
