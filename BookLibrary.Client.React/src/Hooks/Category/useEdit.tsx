import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Types/category";
import { categorySchema } from "../../validation/categorySchema";
import UseFetch from "../UseFetch";

export const useEdit = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resErrMes, setResErrMes] = useState("")
  const navigate = useNavigate() 
  const [dataLoading, setDataLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Category>({
    name: "",
    description: ""
  });


  const { error, fetchData } = UseFetch()

  useEffect(() => {
      const fetchInitial = async () => {
          setDataLoading(true);
          await fetchData<Category>("/Category/" + id, { method: 'get' })
              .then((fetchedData) => {
                  if (!fetchedData) return;
                  setInitialValues(fetchedData);
                  formik.setValues(fetchedData);
              })
              .catch(err => {
                  console.log(error)
                  console.error('There was an error fetching the book!', err);
              })
              .finally(() => {
                  setDataLoading(false);
              })
      }
      fetchInitial();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    isSubmitting,
    dataLoading
  }
}