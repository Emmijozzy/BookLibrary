import { FaList, FaThLarge } from "react-icons/fa"

type Props = {
  totalItems: number, 
  viewMode: string, 
  onViewModeChange: (mode: string) => void
}

const UserListHeader = ({ totalItems, viewMode, onViewModeChange }: Props) => {
  return (
    <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">User List</h1>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
              User Collection ({totalItems} users)
            </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => onViewModeChange('carpet')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ease-in-out ${viewMode === 'carpet' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    <FaThLarge className="text-lg" /> Grid View
                </button>
                <button 
                    onClick={() => onViewModeChange('table')}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ease-in-out ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    <FaList className="text-lg" /> Table View
                </button>
            </div>
        </div>
    </div>
  )
}

export default UserListHeader