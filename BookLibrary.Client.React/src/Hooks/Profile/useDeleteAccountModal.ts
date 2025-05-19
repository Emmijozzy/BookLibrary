import { useState } from 'react';

export const useDeleteAccountModal = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return {
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal
  };
};