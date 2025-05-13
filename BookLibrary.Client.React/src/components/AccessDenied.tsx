const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 transform transition-all">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-3">Access Denied</h1>
          <p className="text-gray-600 text-center mb-6">You do not have the required permissions to access this administrative area.</p>
          <div className="w-full border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 text-center">
              If you believe this is an error, please contact your system administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied