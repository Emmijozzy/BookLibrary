import { User } from "../../Types/User";

export const ProfileHeader = ({ user }: { user: User }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold mb-4 md:mb-0 md:mr-6">
            {user.fullName.split(' ').map(name => name[0]).join('')}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start mt-2 gap-2">
              {user.roles && user.roles.map((role, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    role === 'Admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};