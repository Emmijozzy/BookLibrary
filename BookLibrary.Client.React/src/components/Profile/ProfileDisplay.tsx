import { User } from '../../Types/User';

interface ProfileDisplayProps {
  user: User;
}

const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
          <p className="mt-1 text-base md:text-lg">{user.fullName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
          <p className="mt-1 text-base md:text-lg">{user.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">User ID</h3>
          <p className="mt-1 text-sm text-gray-500">{user.id}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
          <p className="mt-1 text-base md:text-lg">
            {user.roles && user.roles.includes('Admin') ? 'Administrator' : 'Regular User'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;