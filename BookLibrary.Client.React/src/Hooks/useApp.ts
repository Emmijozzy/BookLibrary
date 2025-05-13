import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useApp = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  
  return context;
};