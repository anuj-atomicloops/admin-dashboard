import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function AddProductForm({
  form,
  setForm,
  handleSubmit,
  handleChange,
  categories,
}: any) {
  return (
    <FormStyledContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="formSection space-y-6">
          {/* Name + Category */}
          <div className="formFieldSection">
            <div className="formDoubleField">
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="name">
                  Product Name
                </Label>
                <Input
                  className="inputBox"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product Name"
                  value={form?.name || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="category">
                  Category
                </Label>
                <Select
                  value={form?.category || ""}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger className="inputBox" id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="formFieldSection">
            <div className="formDoubleField">
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="description">
                  Description
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Product Description"
                  value={form?.description || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Price + Available Quantity */}
          <div className="formFieldSection">
            <div className="formDoubleField">
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="price">
                  Price
                </Label>
                <Input
                  className="inputBox"
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price"
                  min={0}
                  value={form?.price || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="availableQuantity">
                  Available Quantity
                </Label>
                <Input
                  className="inputBox"
                  type="number"
                  name="availableQuantity"
                  id="availableQuantity"
                  placeholder="Available Quantity"
                  min={0}
                  value={form?.availableQuantity || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </div>
      </form>
    </FormStyledContainer>
  );
}

export default AddProductForm;
