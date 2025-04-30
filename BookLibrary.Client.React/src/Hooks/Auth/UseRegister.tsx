import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "../../Auth/authInterface";
import { registrationSchema } from "../../validation/registrationSchema";
import useFetch from "../useFetch";

const initialValues: Register  = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const UserRegister = () => {
  const effectRan = useRef(false);
  const [resErrMes, setResErrMes] = useState("")

  const navigate = useNavigate();
  
  const { data, error, loading, fetchData }  = useFetch();

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      try {
        await fetchData("/AuthApi/Register", {method: 'post', data: {...values}});
      } catch (e) {
        const error = e ;
        console.log(error, e);
      } 
    },
  });

  useEffect(() => {
    if (effectRan.current /* || process.env.NODE_ENV !== "development" */) {
      if (data) {
        // console.log(data);
        navigate("/Auth/login");
      } else {
        setResErrMes(error as string);
      }
    }
    return () => {
      effectRan.current = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  const { handleSubmit, handleBlur, handleChange, errors, values } = formik;

  return {
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    values,
   loading,
   resErrMes
  };
};
export default UserRegister;
