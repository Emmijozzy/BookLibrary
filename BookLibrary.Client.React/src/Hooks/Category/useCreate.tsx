import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Types/category";
import { categorySchema } from "../../validation/categorySchema";
import useFetch from "../UseFetch";

const initialValues: Category = {
  name: "",
  description: ""
};

export const useCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resErrMes, setResErrMes] = useState("")
  const navigate = useNavigate() 

  const { fetchData } = useFetch();

  const formik = useFormik({
    initialValues,
    validationSchema: categorySchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        await fetchData("/Category/add", {method: 'post', data: {...values}});
        navigate("/categories")
      } catch (e) {
        const error = e as Error;
        console.log(error, e);
        setResErrMes(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { handleChange, handleSubmit, values, errors } = formik;


  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    resErrMes,
    isSubmitting
  }
}