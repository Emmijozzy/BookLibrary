import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { Book } from '../Types/book';
import useFetch from './useFetch';

export const useBookService = () => {
  const { fetchData, loading, error, data, metadata } = useFetch<Book[]>();

  const getUserBooks = useCallback(async (userId: string, pageNumber: number = 1, pageSize: number = 8) => {
    try {
      const queryParams = new URLSearchParams({
        userId: userId,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      }).toString();
      
      return await fetchData(`Book/user-books/${userId}?${queryParams}`, { method: 'GET' });
    } catch (err) {
      toast.error(`Error loading books: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [fetchData]);

  return {
    getUserBooks,
    books: data,
    booksLoading: loading,
    booksError: error,
    bookMetadata: metadata
  };
};