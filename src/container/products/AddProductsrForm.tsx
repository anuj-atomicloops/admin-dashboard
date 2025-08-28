import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

function AddProductForm({ form, processSubmit, categories }: any) {
  return (
    <FormStyledContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processSubmit)}>
          {/*  -------------------Product Name + Category --------------------*/}
          <div className="formDoubleField">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="formSingleField">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="formSingleField">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="inputBox">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: string) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
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
          {/* -------------------------description------------------------- */}
          <div className="formDoubleField">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="formSingleField">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*------------ Price & Quantity ----------------*/}
          <div className="formDoubleField">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="formSingleField">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availableQuantity"
              render={({ field }) => (
                <FormItem className="formSingleField">
                  <FormLabel>Available Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Available Quantity"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </Form>
    </FormStyledContainer>
  );
}

export default AddProductForm;
