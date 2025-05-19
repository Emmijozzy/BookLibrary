import { useState, useEffect } from 'react';
import useFetch from '../Hooks/useFetch';
import { User } from '../Types/User';


interface AvatarProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const Avatar = ({ userId, size = 'md', showName = true }: AvatarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {fetchData, data, error: resErr,  loading} = useFetch()

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
      try {
        await fetchData(`User/${userId}`, {
          method: 'GET'
        });
        
        if (resErr) {
          setError(resErr || 'Failed to load user details');
        }
      } catch (err) {
        setError('Error fetching user details');
        console.error(err);
      } 
    };

    fetchUserDetails();
  }, [fetchData, resErr, userId]);


  useEffect(() => {
    if (data) {
        setUser(data as User);
      }
  }, [data]);

  // Size classes for the avatar
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  // Generate initials from the user's full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a consistent background color based on the user ID
  const getBackgroundColor = (id: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
    ];
    
    // Simple hash function to get a consistent color
    const hash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse flex items-center justify-center`}>
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center text-gray-600`}>
        <span>?</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div 
        className={`${sizeClasses[size]} ${getBackgroundColor(user.id)} rounded-full flex items-center justify-center text-white font-medium`}
        title={user.fullName}
      >
        {getInitials(user.fullName)}
      </div>
      
      {showName && (
        <span className="ml-2 text-gray-800 font-medium truncate">
          {user.fullName}
        </span>
      )}
    </div>
  );
};

export default Avatar;