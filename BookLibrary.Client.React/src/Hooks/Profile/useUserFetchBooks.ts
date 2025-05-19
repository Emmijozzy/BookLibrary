/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Book } from "../../Types/book";
import useFetch from "../useFetch";

const useUserFetchBooks = (userId: string) => {
    const { 
      data: books, 
      error: booksError, 
      fetchData: fetchBooks, 
      loading: booksLoading, 
      metadata 
    } = useFetch<Book[]>();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
  
    useEffect(() => {
      if (userId) {
        fetchUserBooks();
      }
    }, [userId, currentPage, pageSize]);
  
    useEffect(() => {
      if (booksError) {
        toast.error(`Error loading books: ${booksError}`);
      }
    }, [booksError]);
  
    const fetchUserBooks = () => {
      const queryParams = new URLSearchParams({
        pageNumber: currentPage.toString(),
        pageSize: pageSize.toString()
      }).toString();
      
      fetchBooks(`Book/user-books/${userId}?${queryParams}`, { method: 'GET' });
    };

  return {
    books,
    booksLoading,
    metadata,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize
  }
}

export default useUserFetchBooks