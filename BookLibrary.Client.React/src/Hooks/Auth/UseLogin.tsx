import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../Auth/authInterface";
import loginSchema from "../../validation/loginSchema";
import { useApi } from "../useApi";
import UseFetch from "../UseFetch";

const initialValues: Login = {
    email: "",
    password: "",
};

const UserLogin = () => {
    const navigate = useNavigate();
    const { data, metadata, error, loading, fetchData } = UseFetch();
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuthToken, setAppUser } = useApi();

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                await await fetchData("AuthApi/login", { method: 'post', data: { ...values } });
            } catch (err) {
                console.error("Login error:", err);
            }
        },
    });

    // console.log(data, metadata, error);

    useEffect(() => {
        if (error) {
            setErrorMessage(error as string);
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
    }, [data, metadata, error, navigate, setAppUser, formik.values.email, setAuthToken]);

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

export default UserLogin;
