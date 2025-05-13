export const ProfileTabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'books', label: 'My Books' },
    { id: 'settings', label: 'Account Settings' }
  ];
  
  return (
    <div className="border-b border-gray-200 overflow-x-auto overflow-y-hidden">
      <nav className="flex -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};