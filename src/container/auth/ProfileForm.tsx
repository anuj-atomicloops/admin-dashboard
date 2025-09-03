import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { avatarOptions } from "./Signup";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  image: z.string().url("Please select an avatar"),
  email: z.string().email("Invalid email"),
});

function ProfileForm({ setDialogOpen }: any) {
  const { user, updateAcProfile, authLoading }: any = useAuth();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      image: user?.photoURL || "",
    },
  });

  const onSubmit = async (values: any) => {
    const { name, image } = values;
    const { success, message } = await updateAcProfile({
      displayName: name,
      photoURL: image,
    });

    console.log(success);
    if (success) {
      setDialogOpen(false);
      toast.success(message || "Profile updated successfully!");
    } else {
      toast.error(message || "Failed to update profile");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Account Details</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/*----------------------- Full Name */}
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

          {/*------------------- Email  */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" disabled {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/*--------------------- Profile Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose an Avatar</FormLabel>
                <FormControl>
                  <div className="flex gap-3 flex-wrap">
                    {avatarOptions.map((url: any) => (
                      <img
                        key={url}
                        src={url}
                        alt="avatar"
                        onClick={() => field.onChange(url)}
                        className={`h-12 w-12 rounded-full cursor-pointer border-2 ${
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

          <Button disabled={authLoading} type="submit" className="w-full">
            Save Changes {authLoading && <Spinner />}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ProfileForm;
