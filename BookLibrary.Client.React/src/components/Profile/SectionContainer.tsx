import { ReactNode } from 'react';

interface SectionContainerProps {
  title: string;
  children: ReactNode;
  isDanger?: boolean;
}

const SectionContainer = ({ 
  title, 
  children, 
  isDanger = false 
}: SectionContainerProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      <div className={`p-4 border-b border-gray-200 ${isDanger ? 'bg-red-50' : ''}`}>
        <h3 className={`text-lg font-medium ${isDanger ? 'text-red-800' : ''}`}>{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default SectionContainer;