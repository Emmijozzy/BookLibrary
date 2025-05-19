import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import useFetch from '../useFetch';

const useResetPassword = (token: string | null, email: string | null, userId: string | null) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const { fetchData, error } = useFetch();

  // Define validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!token || !email || !userId) {
        toast.error("Invalid reset link. Please request a new password reset.");
        return;
      }

      setLoading(true);
      
      try {
        await fetchData("AuthApi/ResetPassword", {
          method: "POST",
          data: { ...values, token, email, userId },
        }, "fileApi")

        setResetComplete(true);
        toast.success("Password has been reset successfully");
        navigate('/Auth/login'); 
      } catch (err) {
        console.log("Password reset failed:", error);
        console.error("Password reset failed:", err);
        toast.error("Failed to reset password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const redirectToLogin = () => {
    navigate('/Auth/login');
  };

  return {
    formik,
    loading,
    resetComplete,
    redirectToLogin
  };
};

export default useResetPassword;