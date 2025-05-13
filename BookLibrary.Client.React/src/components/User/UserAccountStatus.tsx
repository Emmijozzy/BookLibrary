import { useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from '../../Hooks/useFetch';

interface UserAccountStatusProps {
  userId: string;
  isLocked: boolean;
  onStatusUpdated: () => void;
}

const UserAccountStatus = ({ 
  userId, 
  isLocked, 
  onStatusUpdated 
}: UserAccountStatusProps) => {
  const [updating, setUpdating] = useState(false);
  const {fetchData, error} = useFetch();
  
  const handleToggleStatus = async () => {
    setUpdating(true);
    try {
      const endpoint = isLocked ? `User/${userId}/unlock` : `User/${userId}/lock`;
      
      await fetchData(endpoint, {
        method: 'PUT',
      });
      
      if (error) {
        throw new Error(`Failed to ${isLocked ? 'unlock' : 'lock'} user account`);
      }
      
      toast.success(`User account ${isLocked ? 'unlocked' : 'locked'} successfully`);
      onStatusUpdated();
    } catch (error) {
      toast.error(`Error updating account status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3">Account Status</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isLocked ? 'Locked' : 'Active'}
          </span>
          <p className="mt-1 text-sm text-gray-600">
            {isLocked 
              ? 'This account is currently locked and the user cannot log in.' 
              : 'This account is active and the user can log in normally.'}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleToggleStatus}
        disabled={updating}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          updating
            ? 'bg-gray-300 cursor-not-allowed'
            : isLocked
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }`}
      >
        {updating 
          ? 'Updating...' 
          : isLocked 
            ? 'Unlock Account' 
            : 'Lock Account'}
      </button>
    </div>
  );
};

export default UserAccountStatus;
