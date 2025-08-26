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

function AddOrdersForm({
  users,
  form,
  setForm,
  products,
  handleSubmit,
  handleChange,
}: any) {
  console.log(users, "users");
  const selectedProduct = products.find((p: any) => p.id === form?.productId);
  const productAvailable = selectedProduct?.availableQuantity || 0;
  const productPrice = selectedProduct?.price || 0;
  const totalAmount = form?.qty ? productPrice * form.qty : 0;
  return (
    <FormStyledContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="!gap-0"
      >
        {/* ------------------------------------------------------ */}
        <div className="formFieldSection">
          <div className="formDoubleField">
            {/*----------------select user ---------------------*/}
            <div className="formSingleField">
              <Label className="inputLabel" htmlFor="user">
                Select User
              </Label>
              <Select
                value={form?.userId || ""}
                onValueChange={(val) => {
                  const user = users.find((u: any) => u.id === val);
                  setForm({ ...form, userId: val, userName: user?.name });
                }}
              >
                <SelectTrigger className="inputBox" id="user">
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
            </div>

            {/*---------------- select product ---------------------*/}
            <div className="formSingleField">
              <Label className="inputLabel" htmlFor="product">
                Select Product
              </Label>
              <Select
                value={form?.productId || ""}
                onValueChange={(val) => {
                  const prod = products.find((p: any) => p.id === val);
                  setForm({
                    ...form,
                    productId: val,
                    productName: prod?.name,
                    qty: 1,
                  });
                }}
              >
                <SelectTrigger className="inputBox" id="product">
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
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {form?.productId && (
          <div className="formFieldSection">
            <div className="formDoubleField">
              {/*---------------- Quantity ---------------------*/}
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="qty">
                  Quantity (Max 5)
                </Label>
                <Input
                  className="inputBox"
                  type="number"
                  name="qty"
                  id="qty"
                  min={1}
                  max={Math.min(5, productAvailable)}
                  value={form?.qty || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      qty: Math.min(
                        Math.max(1, Number(e.target.value)),
                        Math.min(5, productAvailable)
                      ),
                    })
                  }
                />
              </div>
              {/*----------------stock Available ---------------------*/}
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
          </div>
        )}
        {/* ------------------------------------------------------ */}
        {form?.productId && (
          <div className="formFieldSection">
            <div className="formDoubleField">
              {/*---------------- Total Amount ---------------------*/}
              <div className="formSingleField">
                <Label className="inputLabel">Total Amount</Label>
                <Input
                  className="inputBox"
                  type="number"
                  value={totalAmount}
                  disabled
                />
              </div>
              {/*---------------- order status ---------------------*/}
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="status">
                  Order Status
                </Label>
                <Select
                  value={form?.status || "completed"}
                  onValueChange={(val) => setForm({ ...form, status: val })}
                >
                  <SelectTrigger className="inputBox" id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="mt-4 w-full">
          Save Order
        </Button>
      </form>
    </FormStyledContainer>
  );
}

export default AddOrdersForm;
