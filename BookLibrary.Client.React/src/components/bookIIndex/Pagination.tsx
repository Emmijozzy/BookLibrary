interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange
}) => {
    return (
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center mb-3 space-y-3 md:space-y-0">
            <div className="text-sm text-slate-600">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} books
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-3 py-1 rounded-md ${currentPage <= 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    Previous
                </button>
                
                {/* Page number buttons */}
                <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        // Show pages around current page
                        let pageNum = currentPage;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                            <button
                                key={i}
                                onClick={() => onPageChange(pageNum)}
                                className={`px-3 py-1 rounded-md ${pageNum === currentPage 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
                
                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-3 py-1 rounded-md ${currentPage >= totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    Next
                </button>
                <select 
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="ml-4 px-2 py-1 border rounded-md text-sm"
                >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                </select>
            </div>
        </div>
    );
};

export default Pagination;
