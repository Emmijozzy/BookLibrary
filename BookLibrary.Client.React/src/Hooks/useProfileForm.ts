import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ProfileSchema } from '../validation/profileValidation';
import { User } from '../Types/User';
import useFetch from './useFetch';


interface UseProfileFormProps {
  user: User;
  refreshUser: () => void;
  onEditComplete: () => void;
}

export const useProfileForm = ({ user, refreshUser, onEditComplete }: UseProfileFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const {fetchData, error} = useFetch();

  const formik = useFormik({
    initialValues: {
      fullName: user.fullName || '',
      email: user.email || ''
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Form values:', values);
      setIsSaving(true);
      try {
        const paylaod = {
          ...values,
          id: user.id
        }
        await fetchData("User/profile", {
          method: 'PUT',
          data: paylaod,
        }, "fileApi");

        if (error) {
          throw new Error(error);
        }

        toast.success('Profile updated successfully');
        refreshUser();
        onEditComplete();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(errorMessage);
      } finally {
        setIsSaving(false);
        setSubmitting(false);
      }
    }
  });

  return {
    formik,
    isSaving
  };
};