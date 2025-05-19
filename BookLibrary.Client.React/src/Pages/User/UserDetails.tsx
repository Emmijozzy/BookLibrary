import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import DeleteUserModal from '../../components/User/DeleteUserModal';
import UserAccountStatus from '../../components/User/UserAccountStatus';
import UserBooksSection from '../../components/User/UserBooksSection';
import UserInformation from '../../components/User/UserInformation';
import UserProfileHeader from '../../components/User/UserProfileHeader';
import UserRoleManager from '../../components/User/UserRoleManager';
import { useUserService } from '../../Hooks/useUserService';
import { User } from '../../Types/User';
import { handleBack } from '../../Utils/handleBack';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getUser, 
    updateUser, 
    deleteUser, 
    userData: user, 
    userLoading: loading 
  } = useUserService();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isAccountLocked, setIsAccountLocked] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getUser(id);
    }
  }, [id, getUser]);

  useEffect(() => {
    if (user && !editedUser) {
      setEditedUser(user);
      // In a real app, you would get the account status from the API
      setIsAccountLocked(user.locked || false);
    }
  }, [user, editedUser]);  
  
  const handleDeleteUser = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      navigate('/Users');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveUser = async () => {
    if (!editedUser || !id) return;
      setIsEditing(true);
      await updateUser(id, editedUser);
      toast.success('User updated successfully');
      setIsEditing(false);
      getUser(id);
  };

  const handleRolesUpdated = () => {
    if (id) {
      getUser(id);
      toast.success('User roles updated successfully');
    }
  };

  const handleAccountStatusUpdated = () => {
    if (id) {
      getUser(id);
      setIsAccountLocked(!isAccountLocked);
      toast.success(`User account ${isAccountLocked ? 'unlocked' : 'locked'} successfully`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user && !loading) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        User not found or you don't have permission to view this user.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user && (
        <>
          <UserProfileHeader 
            user={user}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
            onBackClick={handleBack}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <UserInformation 
              user={user}
              editedUser={editedUser}
              isEditing={isEditing}
              onUserChange={setEditedUser}
              onSave={handleSaveUser}
            />
            
            <div className="space-y-4">
              <UserRoleManager 
                userId={user.id}
                currentRoles={user.roles}
                onRolesUpdated={handleRolesUpdated}
              />
              
              <UserAccountStatus
                userId={user.id}
                isLocked={isAccountLocked}
                onStatusUpdated={handleAccountStatusUpdated}
              />
            </div>
          </div>
          
          <UserBooksSection userId={user.id} />

          <DeleteUserModal
            user={user}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteUser}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
};

export default UserDetails;