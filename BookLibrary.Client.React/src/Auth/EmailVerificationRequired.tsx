import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useEmailVerification from "../Hooks/Auth/useEmailVerification";

interface EmailVerificationRequiredProps {
  email: string;
}

const EmailVerificationRequired = ({ 
  email, 
}: EmailVerificationRequiredProps) => {
  const {
    isResending,
    resendCount,
    resendCooldown,
    resendVerificationEmail
  } = useEmailVerification({ email });

  const handleBackToLogin = () => {
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Email Verification Required</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your account has been created, but you need to verify your email address before you can log in.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                We've sent a verification link to <span className="font-medium">{email}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Please check your email inbox and click on the verification link to activate your account.</p>
            <p className="mt-2">If you don't see the email, check your spam folder.</p>
          </div>

          <div className="pt-4">
            <button
              onClick={resendVerificationEmail}
              disabled={isResending || resendCooldown > 0}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                resendCooldown > 0 ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isResending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : resendCooldown > 0 ? (
                `Resend available in ${resendCooldown}s`
              ) : (
                `Resend verification email${resendCount > 0 ? ` (${resendCount})` : ''}`
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="text-sm text-gray-600">
            <p>Already verified your email?</p>
            <button
              onClick={handleBackToLogin}
              className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try logging in again
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Need help? <Link to="/contact" className="text-indigo-600 hover:text-indigo-500">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationRequired;