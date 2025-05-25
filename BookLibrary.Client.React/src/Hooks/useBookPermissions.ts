import { useApp } from "./useApp"

export const useBookPermissions = (createdBy?: string) => {
  const { appUserId, currentRole } = useApp()
  
  const isOwner = appUserId === createdBy
  const isAdmin = currentRole === 'Admin'
  const isAdminOrOwner = isAdmin || isOwner
  
  return {
    isOwner,
    isAdmin,
    isAdminOrOwner,
    canEdit: isOwner,
    canDelete: isAdminOrOwner,
    canView: true // Everyone can view details
  }
}