import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useFetch from "../../Hooks/useFetch";
import { User } from "../../Types/User";
import SearchBar from "../../components/SearchBar";
import { UserListContent } from "../../components/User/UserListContent";
import UserListHeader from "../../components/User/UserListHeader";
import { UserFilters } from "../../components/UserFilters";
import Pagination from "../../components/bookIIndex/Pagination";

interface UserQuery {
  searchTerm?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  pageNumber: number;
  pageSize: number;
  includeProperties?: string;
}


const UserIndex = () => {
  const { data, error, fetchData, metadata, loading } = useFetch();
  const [viewMode, setViewMode] = useState(localStorage.getItem('viewMode') || 'carpet');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [query, setQuery] = useState<UserQuery>({
      pageNumber: 1,
      pageSize: 10
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Function to fetch books with query parameters
  const fetchBooks = useCallback(async (queryParams: UserQuery) => {
      
      // Convert query object to URL parameters
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
              params.append(key, value.toString());
          }
      });
      
      const queryString = params.toString();
      const endpoint = `User/all${queryString ? `?${queryString}` : ''}`;
      
      await fetchData(endpoint, { method: 'get' });
  }, [fetchData]);

  // Update query when search term or field changes
  useEffect(() => {
      if (searchTerm) {
          setQuery(prev => ({
              ...prev,
              searchTerm,
          }));
      } else {
          // Remove search parameters if search term is empty
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { searchTerm: _, ...rest } = query;
          setQuery(rest);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchField]);

  // Fetch books when query changes
  useEffect(() => {
    fetchBooks(query);
  }, [query, fetchBooks]);

  // Update pagination metadata when data changes
  useEffect(() => {
    if (metadata) {
        setTotalPages(metadata.totalPages as number || 1);
        setTotalItems(metadata.totalCount as number || 0);
    }
  }, [metadata]);

  // Notify for error 
  useEffect ( () => {
      if (error) {
          toast.error(error);
      }

      if (loading === false) {
          toast.clearWaitingQueue();
      }       
  }, [error, loading]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setQuery(prev => ({
            ...prev,
            pageNumber: newPage
        }));
    }
  }, [totalPages]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName: string, value: string | number) => {
      setQuery(prev => ({
          ...prev,
          pageNumber: 1, // Reset to page 1 when changing filters
          [filterName]: value
      }));
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((size: number) => {
      setQuery(prev => ({
          ...prev,
          pageNumber: 1,
          pageSize: size
      }));
  }, []);

  // Handle view mode change
  const handleViewMode = useCallback((mode: string) => {
      setViewMode(mode);
      localStorage.setItem('viewMode', mode)
  }, []);


  if (error) {
      return <div className="p-6 bg-red-50 text-red-700 rounded-lg">Error: {error as string}</div>;
  }

  const users = data as unknown as User[] || [];
  

  return (
    <div className= "h-full flex flex-col mt-2.5 pb-3">
        <UserListHeader totalItems={totalItems} viewMode={viewMode} onViewModeChange={handleViewMode} />

        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <SearchBar 
                        setSearchTerm={setSearchTerm} 
                        setSearchField={setSearchField} 
                        searchTerm={searchTerm} 
                        searchField={searchField} 
                        searchOptions={["name", "email"]}
                    />
                </div>                
                <UserFilters 
                    onFilterChange={handleFilterChange}
                    currentRole={query.role || ''}
                    currentStatus={query.status || ''}
                    currentSortBy={query.sortBy || ''}
                />
            </div>
        </div>

        {users && <UserListContent users={users} viewMode={viewMode} loading={loading} />}

        <Pagination 
            currentPage={query.pageNumber}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={query.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
        />
    </div>
  )
}

export default UserIndex