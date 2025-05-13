import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import AccountSettings from "../../components/Profile/AccountSettings";
import { ActivitySummary } from "../../components/Profile/ActivitySummary";
import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import ProfileInformation from "../../components/Profile/ProfileInformation";
import { ProfileTabs } from "../../components/Profile/ProfileTabs";
import UserProfileBooks from "../../components/Profile/UserProfileBooks";
import useUserFetchBooks from "../../Hooks/Profile/useUserFetchBooks";
import useFetch from "../../Hooks/useFetch";
import { User } from "../../Types/User";
import { Book } from "../../Types/book";

const UserProfile = () => {
  const { 
    data: user, 
    error: userError, 
    fetchData: fetchUser, 
    loading: userLoading 
  } = useFetch<User>();

  const {
    books,
    booksLoading,
    metadata,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize
  } = useUserFetchBooks(user?.id as string);
  
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    // Fetch current user profile
    fetchUser('User/profile', { method: 'GET' });
  }, [fetchUser]);

  useEffect(() => {
    if (userError) {
      toast.error(`Error loading profile: ${userError}`);
    }
  }, [userError]);

  if (userLoading) {
    return (
      <LoadingSpinner />
    );
  }

  if (!user && !userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 text-red-700 rounded-lg">
          Unable to load profile. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user && (
        <>
          <ProfileHeader user={user} />
          
          <div className="bg-white rounded-lg shadow-md mb-8">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="p-6">
              {activeTab === 'profile' && (
                <ProfileInformation user={user} refreshUser={() => fetchUser('User/profile', { method: 'GET' })} />
              )}
              
              {activeTab === 'books' && (
                <UserProfileBooks books={books as Book[]} booksLoading={booksLoading} metadata={metadata} currentPage={currentPage} pageSize={pageSize} setCurrentPage={setCurrentPage} setPageSize={setPageSize} />
              )}
              
              {activeTab === 'settings' && (
                <AccountSettings />
              )}
            </div>
          </div>
          
          <ActivitySummary user={user} bookCount={metadata?.totalCount as number} />
        </>
      )}
    </div>
  );
};
export default UserProfile;