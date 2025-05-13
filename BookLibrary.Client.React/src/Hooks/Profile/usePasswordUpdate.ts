import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { PasswordSchema } from '../../validation/PasswordValidation';
import useFetch from '../useFetch';

export const usePasswordUpdate = () => {
  const { fetchData } = useFetch();
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: PasswordSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        await fetchData('User/profile/change-password', { 
          method: 'PUT', 
          data: { ...values } 
        }, "fileApi");
        
        toast.success('Password updated successfully');
        resetForm();
        setIsSuccess(true);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Error updating password: ${errorMessage || 'Unknown error'}`);
        setIsSuccess(false);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return {
    passwordFormik,
    isSubmitting: passwordFormik.isSubmitting,
    isSuccess
  };
};