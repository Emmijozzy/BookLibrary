import { useState } from 'react';
import { useProfileForm } from '../../Hooks/useProfileForm';
import { User } from '../../Types/User';
import ProfileDisplay from './ProfileDisplay';
import ProfileForm from './ProfileForm';
import ProfileInfoHeader from './ProfileInfoHeader';

interface ProfileInformationProps {
  user: User;
  refreshUser: () => void;
}

const ProfileInformation = ({ user, refreshUser }: ProfileInformationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditComplete = () => {
    setIsEditing(false);
  };
  
  const { formik, isSaving } = useProfileForm({
    user,
    refreshUser,
    onEditComplete: handleEditComplete
  });

  return (
    <div className="max-w-2xl mx-auto">
      <ProfileInfoHeader 
        isEditing={isEditing} 
        onEditClick={() => setIsEditing(true)} 
      />
      
      {isEditing ? (
        <ProfileForm 
          formik={formik} 
          isSaving={isSaving} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <ProfileDisplay user={user} />
      )}
    </div>
  );
};

export default ProfileInformation;