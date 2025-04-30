import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Login } from "../../Auth/authInterface";
import loginSchema from "../../validation/loginSchema";
import { useApi } from "../useApi";
import useFetch from "../useFetch";

const initialValues: Login = {
    email: "",
    password: "",
};

const useLogin = () => {
    const navigate = useNavigate();
    const { data, metadata, error, loading, fetchData } = useFetch();
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuthToken, setAppUser } = useApi();

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
         await fetchData("AuthApi/login", { method: 'post', data: { ...values } });
        },
    });

    useEffect(() => {
        if (error) {
            setErrorMessage(error as string);
                toast.error(errorMessage, {
                    closeButton: true,
                    autoClose: 3000,
                });
        } else if (metadata?.accessToken) {
            const token = metadata.accessToken as string;
            const email = formik.values.email;

            // Store auth data
            localStorage.setItem('authToken', token);
            localStorage.setItem('appUser', email);

            // Update app context
            setAppUser(email);
            setAuthToken(token);

            // Navigate to books page
            navigate("/Books");
        }

        return () => {
            setErrorMessage("");
        }
    }, [data, metadata, error, navigate, setAppUser, formik.values.email, setAuthToken, errorMessage]);

    return {
        handleSubmit: formik.handleSubmit,
        handleBlur: formik.handleBlur,
        handleChange: formik.handleChange,
        errors: formik.errors,
        values: formik.values,
        loading,
        resData: data,
        resErrMes: errorMessage
    };
};
export default useLogin;
