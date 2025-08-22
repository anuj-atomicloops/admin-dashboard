import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormStyledContainer } from "./styles";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AddUserForm({ form, setForm, handleSubmit, handleChange }: any) {
  return (
    <FormStyledContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="formSection space-y-6">
          {/* ID + Name */}
          <div className="formFieldSection">
            <div className="formDoubleField">
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="name">
                  Name
                </Label>
                <Input
                  className="inputBox"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={form?.name || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Email + Phone */}
          <div className="formFieldSection">
            <div className="formDoubleField">
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="email">
                  Email
                </Label>
                <Input
                  className="inputBox"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={form?.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="phone">
                  Phone Number
                </Label>
                <Input
                  className="inputBox"
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Phone Number"
                  value={form?.phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Status and role */}
          <div className="formFieldSection">
            <div className="formDoubleField">
              <div className="formSingleField">
                <Label className="inputLabel" htmlFor="status">
                  Status
                </Label>
                <Select
                  value={form?.status || ""}
                  onValueChange={(val) => setForm({ ...form, status: val })}
                >
                  <SelectTrigger className="inputBox" id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Checkbox */}
              <div className="formSingleField flex flex-col gap-2">
                <Label className="inputLabel">Role</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="role-admin"
                      checked={form?.role === "admin"}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, role: checked ? "admin" : "" })
                      }
                    />
                    <Label htmlFor="role-admin">Admin</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="role-customer"
                      checked={form?.role === "customer"}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, role: checked ? "customer" : "" })
                      }
                    />
                    <Label htmlFor="role-customer">Customer</Label>
                  </div>
                </div>
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

export default AddUserForm;
