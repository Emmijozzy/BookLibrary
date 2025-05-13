/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useBookService } from '../../Hooks/useBookService';
import BookCard from '../BookCard';
import { BookIcon } from '../Icons/BookIcon';
import { LoadingSpinner2 } from '../LoadingSpinner2';
import UserBooksPagination from './UserBooksPagination';

interface UserBooksSectionProps {
  userId: string;
}

const UserBooksSection = ({ userId }: UserBooksSectionProps) => {
  const { getUserBooks, books, booksLoading, bookMetadata } = useBookService();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (userId) {
      fetchUserBooks();
    }
  }, [currentPage, pageSize, userId]);

  useEffect(() => {
    if (bookMetadata && bookMetadata.totalCount) {
      setTotalPages(Math.ceil(Number(bookMetadata.totalCount) / pageSize));
    }
  }, [bookMetadata, pageSize]);

  const fetchUserBooks = async () => {
    if (!userId) return;
    await getUserBooks(userId, currentPage, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">User's Books</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="pageSize" className="text-sm text-gray-600 mr-2">Show:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border rounded-md p-1 text-sm"
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
              <option value={32}>32</option>
            </select>
          </div>
        </div>
      </div>

      {booksLoading ? (
        <LoadingSpinner2 />
      ) : books && books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {books.map((book) => (
            <BookCard key={book.id} item={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
          <BookIcon />
          <p className="text-sm sm:text-base text-gray-600">No books found for this user.</p>
        </div>
      )}
      
      {books && books.length > 0 && (
        <div className="mt-4 sm:mt-6">
          <UserBooksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserBooksSection;