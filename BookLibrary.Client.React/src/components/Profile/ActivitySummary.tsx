import { User } from "../../Types/User";

export const ActivitySummary = ({ user, bookCount = 0 }: { user: User, bookCount?: number }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4 md:mb-6">Activity Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Books</p>
              <p className="text-xl md:text-2xl font-bold text-blue-800">{bookCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className={`${user.locked ? 'bg-red-50' : 'bg-green-50'} p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${user.locked ? 'text-red-600' : 'text-green-600'}`}>Account Status</p>
              <p className={`text-xl md:text-2xl font-bold ${user.locked ? 'text-red-800' : 'text-green-800'}`}>
                {user.locked ? 'Locked' : 'Active'}
              </p>
            </div>
            <div className={`${user.locked ? 'bg-red-100' : 'bg-green-100'} p-3 rounded-full`}>
              {user.locked ? (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Account Type</p>
              <p className="text-xl md:text-2xl font-bold text-purple-800">
                {user.roles && user.roles.includes('Admin') ? 'Admin' : 'User'}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};