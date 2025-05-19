import { Link } from 'react-router-dom';

interface AccountRestrictedPageProps {
  reason?: 'deleted' | 'locked';
}

const AccountRestrictedPage = ({ reason = "locked" }: AccountRestrictedPageProps) => {
  const isDeleted = reason === 'deleted';
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full ${isDeleted ? 'bg-red-100' : 'bg-yellow-100'} flex items-center justify-center`}>
            {isDeleted ? (
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V7a3 3 0 00-3-3H9a3 3 0 00-3 3v4m9 0h6m-6 0H9" />
              </svg>
            )}
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isDeleted ? 'Account Deleted' : 'Account Locked'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isDeleted 
            ? 'Your account has been deleted from our system.' 
            : 'Your account has been temporarily locked.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className={`p-4 rounded-md ${isDeleted ? 'bg-red-50' : 'bg-yellow-50'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {isDeleted ? (
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${isDeleted ? 'text-red-800' : 'text-yellow-800'}`}>
                    {isDeleted ? 'Account Deletion Information' : 'Account Lock Information'}
                  </h3>
                  <div className={`mt-2 text-sm ${isDeleted ? 'text-red-700' : 'text-yellow-700'}`}>
                    <p>
                      {isDeleted 
                        ? 'Your account has been permanently deleted from our system. All associated data has been removed in accordance with our data retention policy.' 
                        : 'Your account has been temporarily locked due to suspicious activity or a violation of our terms of service.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">What can you do now?</h4>
              
              {isDeleted ? (
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>If you believe this is an error, please contact our support team.</li>
                  <li>If you'd like to create a new account, you can register again.</li>
                </ul>
              ) : (
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>Contact our support team to understand why your account was locked.</li>
                  <li>Verify your identity to help us unlock your account.</li>
                  <li>Review our terms of service to ensure compliance in the future.</li>
                </ul>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <Link
                to="/contact-support"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </Link>
              
              {isDeleted && (
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create New Account
                </Link>
              )}
              
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRestrictedPage;
