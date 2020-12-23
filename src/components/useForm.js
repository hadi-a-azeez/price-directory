import { useState } from "react";

export const useForm = (initialValue) => {
  const [values, setValues] = useState(initialValue);

  return [
    values,
    (data) => {
      setValues({ ...values, ...data });
    },
    (e) => {
      console.log(values);
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
  ];
};
