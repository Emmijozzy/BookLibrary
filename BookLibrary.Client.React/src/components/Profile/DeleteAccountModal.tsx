import { useAccountDeletion } from '../../Hooks/Profile/useAccountDeletion';
import Modal from '../common/Modal';

const DeleteAccountModal = ({ isOpen, onClose, }: { isOpen: boolean, onClose: () => void }) => {
  const {     
    formik,
    isDeleting,
  } = useAccountDeletion()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      <div className="space-y-4">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="mb-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              To confirm deletion, please type <strong>DELETE</strong> in the field below and enter your password.
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-1">
              Type DELETE to confirm
            </label>
            <input
              id="confirmText"
              type="text"
              {...formik.getFieldProps('confirmText')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="DELETE"
            />
            {formik.touched.confirmText && formik.errors.confirmText && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.confirmText}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Your Password
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.password}</div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty || isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;