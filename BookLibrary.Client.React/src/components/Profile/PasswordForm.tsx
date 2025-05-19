import { FormikProps } from 'formik';

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormProps {
  formik: FormikProps<PasswordFormValues>;
}

const PasswordForm = ({ formik }: PasswordFormProps) => {
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your current password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.currentPassword}
        />
        {formik.touched.currentPassword && formik.errors.currentPassword && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.currentPassword}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter new password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.newPassword}
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Confirm new password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</div>
        )}
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {formik.isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;