import { BookFilters } from "../../../components/bookIIndex/BookFiltersProps";
import { BookListContent } from "../../../components/bookIIndex/BookListContent";
import { BookListHeader } from "../../../components/bookIIndex/BookListHeader";
import Pagination from "../../../components/bookIIndex/Pagination";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import SearchBar from "../../../components/SearchBar";
import useAdminBook from "../../../Hooks/Book/Admin/useAdminBook";
import { Book } from "../../../Types/book";

// Main component
const BookAdmin = () => {
    const {
        data,
        error,
        loading,
        viewMode,
        setViewMode,
        searchTerm,
        setSearchTerm,
        searchField,
        setSearchField,
        query,
        totalPages,
        totalItems,
        handlePageChange,
        handleFilterChange,
        handlePageSizeChange,
    } = useAdminBook();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="p-6 bg-red-50 text-red-700 rounded-lg">Error: {error as string}</div>;
    }

    const books = data as unknown as Book[] || [];

    return (
        <div className="h-full flex flex-col mt-2.5 pb-3">
            <BookListHeader 
                totalItems={totalItems} 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
            />
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar 
                            setSearchTerm={setSearchTerm} 
                            setSearchField={setSearchField} 
                            searchTerm={searchTerm} 
                            searchField={searchField} 
                            searchOptions={["Title", "Author", "ISBN", "Genre", "Publisher", "Language", ""]}
                        />
                    </div>
                    
                    <BookFilters 
                        onFilterChange={handleFilterChange}
                        currentGenre={query.genre || ''}
                        currentSortBy={query.sortBy || ''}
                    />
                </div>
            </div>

            <BookListContent books={books} viewMode={viewMode} />

            <Pagination 
                currentPage={query.pageNumber}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={query.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    );
};

export default BookAdmin;