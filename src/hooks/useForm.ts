import { useState, useCallback } from "react";

function useForm(initialState = {}, onSubmit: any) {
  const [form, setForm] = useState(initialState);

  //------------- handle input changes
  const handleChange = useCallback((event: any, capitalize: any) => {
    const { name, value, type, checked } = event.target;
    const updatedValue = capitalize ? value.toUpperCase() : value;

    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : updatedValue,
    }));
  }, []);

  //---------------- handle form submit
  const handleSubmit = useCallback(
    (event: any) => {
      event?.preventDefault();
      onSubmit?.(form);
    },
    [form, onSubmit]
  );

  // ----------------reset form to initial state
  const resetForm = useCallback(() => {
    setForm(initialState);
  }, [initialState]);

  // -----------------set value
  const setInForm = useCallback((name: any, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    form,
    setForm,
    handleChange,
    handleSubmit,
    resetForm,
    setInForm,
  };
}

export default useForm;
