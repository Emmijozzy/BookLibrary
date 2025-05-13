import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from '../../Hooks/useFetch';

interface UserRoleManagerProps {
  userId: string;
  currentRoles: string[];
  onRolesUpdated: () => void;
}

const UserRoleManager = ({ 
  userId, 
  currentRoles, 
  onRolesUpdated 
}: UserRoleManagerProps) => {
  const [roles, setRoles] = useState<string[]>(currentRoles);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableRoles] = useState(['User', 'Admin']);
  const { error, fetchData, message } = useFetch();

  
  useEffect(() => {
    setRoles(currentRoles);
  }, [currentRoles]);
  
  const handleRoleToggle = (role: string) => {
    if (roles.includes(role)) {
      // Don't allow removing the last role
      if (roles.length === 1) {
        toast.warning("User must have at least one role");
        return;
      }
      setRoles(roles.filter(r => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };
  
  const handleUpdateRoles = async () => {
    setIsUpdating(true);
    try {
      await fetchData(`User/${userId}/roles`, {
        method: 'PUT',
        data: {roles},
      });
      
      if (error) {
        console.error(error, 'Failed to update user roles');
        throw new Error('Failed to update user roles');
      }
      
      toast.success(message || 'User roles updated successfully');
      onRolesUpdated();
    } catch (error) {
      toast.error(`Error updating roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
      toast.clearWaitingQueue();
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3">Manage User Roles</h3>
      
      <div className="space-y-2 mb-4">
        {availableRoles.map(role => (
          <div key={role} className="flex items-center">
            <input
              type="checkbox"
              id={`role-${role}`}
              checked={roles.includes(role)}
              onChange={() => handleRoleToggle(role)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`role-${role}`} className="ml-2 block text-sm text-gray-900">
              {role}
            </label>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleUpdateRoles}
        disabled={isUpdating || JSON.stringify(roles) === JSON.stringify(currentRoles)}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isUpdating || JSON.stringify(roles) === JSON.stringify(currentRoles)
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUpdating ? 'Updating...' : 'Update Roles'}
      </button>
    </div>
  );
};

export default UserRoleManager;
