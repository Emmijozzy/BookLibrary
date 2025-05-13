/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { User } from '../Types/User';
import useFetch from './useFetch';

export const useUserService = () => {
  const { fetchData, loading, error, data, clearError } = useFetch<User>();
  const { fetchData: fetchRolesData } = useFetch<string[]>();
  const { fetchData: fetchStatusData } = useFetch<boolean>();

  const getUser = useCallback(async (id: string) => {
    try {
      return await fetchData(`User/${id}`, { method: 'GET' });
    } catch (err) {
      toast.error(`Error loading user: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [fetchData]);

  const updateUser = useCallback(async (id: string, userData: User) => {
    try {
      const { roles: _, ...rest } = userData
      return await fetchData(`User/${id}`, { 
        method: 'PUT',
        data: rest
      });
    } catch (err) {
      toast.error(`Error updating user: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [fetchData]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      return await fetchData(`User/${id}/`, { method: 'DELETE' });
    } catch (err) {
      toast.error(`Error deleting user: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [fetchData]);

  const updateUserRoles = useCallback(async (id: string, roles: string[]) => {
    try {
      return await fetchRolesData(`User/${id}/roles`, { 
        method: 'PUT',
        data: { roles }
      });
    } catch (err) {
      toast.error(`Error updating user roles: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [fetchRolesData]);

  const updateUserAccountStatus = useCallback(async (id: string, isLocked: boolean) => {
    try {
      return await fetchStatusData(`User/${id}/account-status`, { 
        method: 'PUT',
        data: { isLocked }
      });
    } catch (err) {
      toast.error(`Error updating account status: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [fetchStatusData]);

  return {
    getUser,
    updateUser,
    deleteUser,
    updateUserRoles,
    updateUserAccountStatus,
    userData: data,
    userLoading: loading,
    userError: error,
    clearUserError: clearError
  };
};