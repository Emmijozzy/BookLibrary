interface Props {
  isEditing: boolean;
  onEditClick: () => void;
}

const ProfileInfoHeader = ({ isEditing, onEditClick }: Props) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Profile Information</h2>
      {!isEditing && (
        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm md:text-base"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileInfoHeader;
