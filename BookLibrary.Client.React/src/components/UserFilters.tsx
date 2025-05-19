
interface UserFiltersProps {
  onFilterChange: (filterName: string, value: string | number) => void;
  currentRole: string;
  currentSortBy: string;
  currentStatus: string;
}

export const UserFilters = ({
  onFilterChange,
  currentRole,
  currentStatus,
  currentSortBy
}: UserFiltersProps) => {
  return (
    <div className="flex gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">Role</label>
        <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={currentRole}
            onChange={(e) => onFilterChange('role', e.target.value)}
        >
            <option value="">All Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">Status</label>
        <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 capitalize"
            value={currentStatus}
            onChange={(e) => onFilterChange('status', e.target.value)}
        >
            <option value="">All Status</option>
            <option value="locked">Locked</option>
            <option value="unlocked">unlocked</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 capitalize"
            value={currentSortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
            <option value="">Default</option>
            <option value="name">name</option>
            <option value="name_desc">name (Z-A)</option>
            <option value="email">email</option>
            <option value="email_desc">email (Z-A)</option>
        </select>
      </div>
  </div>
  )
}