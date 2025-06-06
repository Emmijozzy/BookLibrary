import { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';

export const useApi = () => {
  const context = useContext(ApiContext);
  
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  
  return context;
};
