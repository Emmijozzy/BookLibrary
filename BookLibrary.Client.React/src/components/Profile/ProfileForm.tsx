import { FormikProps } from 'formik';

interface ProfileFormValues {
  fullName: string;
  email: string;
}

interface ProfileFormProps {
  formik: FormikProps<ProfileFormValues>;
  isSaving: boolean;
  onCancel: () => void;
}

const ProfileForm= ({ formik, isSaving, onCancel }: ProfileFormProps) => {
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.fullName}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.fullName}</div>
        )}
      </div>
    
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.email}</div>
        )}
      </div>
    
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          disabled={formik.isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;