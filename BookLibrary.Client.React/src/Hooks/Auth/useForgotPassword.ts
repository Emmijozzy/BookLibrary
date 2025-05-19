import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useFetch from '../useFetch';

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { fetchData, error } = useFetch();
  // const [message, setMessage] = useState()

  // Define validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      
      try {
        await fetchData("AuthApi/ForgetPassword", {
          method: "POST",
          data: { ...values }
        })        
        setSubmittedEmail(values.email);
        setSubmitted(true);
        toast.success("Password reset link sent to your email");
      } catch (err) {
        console.error("Password reset request failed:", error, err);
        toast.error("Failed to send password reset link. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const resetForm = () => {
    setSubmitted(false);
    formik.resetForm();
  };

  return {
    formik,
    loading,
    submitted,
    submittedEmail,
    resetForm
  };
};

export default useForgotPassword;