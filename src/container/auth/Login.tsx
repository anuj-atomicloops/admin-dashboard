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

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export default function LoginContainer() {
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: any) => {
    const { success, message } = await login(values);

    if (success) {
      navigate("/dashboard");
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="border w-[30%] p-6 rounded-xl shadow-md ">
        <h2 className="text-2xl font-bold mb-6 text-center ">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button disabled={authLoading} type="submit" className="w-full">
              Login {authLoading && <Spinner />}
            </Button>
          </form>
        </Form>

        {/* 🔹 Signup link */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
