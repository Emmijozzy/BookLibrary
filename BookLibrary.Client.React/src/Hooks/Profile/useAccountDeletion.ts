import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DeleteAccountSchema } from '../../validation/DeleteAccountSchema';
import useFetch from '../useFetch';

export const useAccountDeletion = () => {
  const { fetchData, loading } = useFetch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
    
    const formik = useFormik({
      initialValues: {
        confirmText: '',
        password: '',
      },
      validationSchema: DeleteAccountSchema,
      onSubmit: async (values, { setSubmitting }) => {
        setIsDeleting(true);
        try {
          await fetchData(`User/profile/`, {
              method: 'delete',
              data: { ...values }
            }, "fileApi");          
          toast.success('Account successfully deleted');
          navigate('/Auth/login');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          toast.error(`Error deleting account: ${errorMessage || 'Unknown error'}`);
        } finally {
          setIsDeleting(false);
          setSubmitting(false);
        }
      },
    });

  return {
    formik,
    isDeleting,
    loading
  };
};