import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useFetch from "../useFetch";

interface BookQuery {
  searchTerm?: string;
  searchBy?: string;
  publishedAfter?: string;
  genre?: string;
  sortBy?: string;
  pageNumber: number;
  pageSize: number;
  includeProperties?: string;
  isPrivate?: boolean;
}

const useBook = (userId?: string) => {
  const { data, error, fetchData, loading, metadata } = useFetch();
    const [viewMode, setViewMode] = useState('carpet');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('title');
    const [query, setQuery] = useState<BookQuery>({
        pageNumber: 1,
        pageSize: 10
    });
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Function to fetch books with query parameters
    const fetchBooks = useCallback(async (queryParams: BookQuery) => {        
        // Convert query object to URL parameters
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });
        
        const queryString = params.toString();
        const endpoint = userId ?  `Book/user-books/${userId}${queryString ? `?${queryString}` : ''}`:  `Book/all-public-books${queryString ? `?${queryString}` : ''}`;
        
        await fetchData(endpoint, { method: 'get' });
    }, [fetchData, userId]);

    // Update query when search term or field changes
    useEffect(() => {
        if (searchTerm) {
            setQuery(prev => ({
                ...prev,
                searchTerm,
                searchBy: searchField
            }));
        } else {
            // Remove search parameters if search term is empty
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { searchTerm: _, searchBy: __, ...rest } = query;
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
        if (error && loading === false) {
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

  return {
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
    setQuery,
    totalPages,
    totalItems,
    handlePageChange,
    handleFilterChange,
    handlePageSizeChange,
    fetchBooks
  }
}

export default useBook