import { handleBack } from "../Utils/handleBack";

  type Props = {
  message?: string; 
}

const AccessDenied2 = ({ message = "You are not authorized to Access this Action or Resources" }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <button
                onClick={handleBack}
                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
                Go Back
            </button>
        </div>
    </div>
  )
}

export default AccessDenied2