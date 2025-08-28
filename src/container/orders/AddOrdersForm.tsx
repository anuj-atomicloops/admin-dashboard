import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormStyledContainer } from "../users/styles";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function AddOrdersForm({
  form,
  users,
  products,
  processSubmit,
  statuses,
}: any) {
  const selectedProduct = products.find(
    (p: any) => p.id === form.watch("productId")
  );
  const productAvailable = selectedProduct?.availableQuantity || 0;
  const productPrice = selectedProduct?.price || 0;
  const qty = form.watch("qty") || 0;
  const totalAmount = qty ? productPrice * qty : 0;

  return (
    <FormStyledContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processSubmit)} className="!gap-0">
          <div className="formSection space-y-6">
            {/* ------------------- Select User + Product ------------------- */}
            <div className="formDoubleField">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="formSingleField">
                    <FormLabel>Select User</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          const user = users.find((u: any) => u.id === val);
                          form.setValue("userId", val);
                          form.setValue("userName", user?.name || "");
                        }}
                      >
                        <SelectTrigger className="inputBox">
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((u: any) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem className="formSingleField">
                    <FormLabel>Select Product</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          const prod = products.find((p: any) => p.id === val);
                          form.setValue("productId", val);
                          form.setValue("productName", prod?.name || "");
                          form.setValue("qty", 1); // default to 1
                        }}
                      >
                        <SelectTrigger className="inputBox">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p: any) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} - ₹{p.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ------------------- Quantity + Stock ------------------- */}
            {form.watch("productId") && (
              <div className="formDoubleField">
                <FormField
                  control={form.control}
                  name="qty"
                  render={({ field }) => (
                    <FormItem className="formSingleField">
                      <FormLabel>Quantity (Max 5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={Math.min(5, productAvailable)}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Math.min(
                                Math.max(1, Number(e.target.value)),
                                Math.min(5, productAvailable)
                              )
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="formSingleField">
                  <Label className="inputLabel">Available Stock</Label>
                  <Input
                    className="inputBox"
                    type="number"
                    value={productAvailable}
                    disabled
                  />
                </div>
              </div>
            )}

            {/* ------------------- Total Amount + Status ------------------- */}
            {form.watch("productId") && (
              <div className="formDoubleField">
                <div className="formSingleField">
                  <Label>Total Amount</Label>
                  <Input type="number" value={totalAmount} disabled />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="formSingleField">
                      <FormLabel>Order Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "completed"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="inputBox">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((item: any, idx: any) => (
                              <SelectItem key={idx} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* ------------------- Submit ------------------- */}
            <Button type="submit" className="mt-4 w-full">
              Save Order
            </Button>
          </div>
        </form>
      </Form>
    </FormStyledContainer>
  );
}

export default AddOrdersForm;
