import { useDeleteAccountModal } from '../../Hooks/Profile/useDeleteAccountModal';
import { usePasswordUpdate } from '../../Hooks/Profile/usePasswordUpdate';
import DangerZone from './DangerZone';
import DeleteAccountModal from './DeleteAccountModal';
import PasswordForm from './PasswordForm';
import SectionContainer from './SectionContainer';

const AccountSettings = () => {
  const { passwordFormik } = usePasswordUpdate();
  const { isDeleteModalOpen, openDeleteModal, closeDeleteModal } = useDeleteAccountModal();

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
      
      {/* Password Change Section */}
      <SectionContainer title="Change Password">
        <PasswordForm formik={passwordFormik} />
      </SectionContainer>
      
      {/* Account Danger Zone */}
      <SectionContainer title="Danger Zone" isDanger={true}>
        <DangerZone onDeleteClick={openDeleteModal} />
      </SectionContainer>
      
      {/* Use your existing DeleteAccountModal component */}
      {isDeleteModalOpen && (
        <DeleteAccountModal 
          onClose={closeDeleteModal} 
          isOpen={isDeleteModalOpen}
        />
      )}
    </div>
  );
};

export default AccountSettings;