 import { SetStateAction, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../Types/book';
import BookCard from '../BookCard';
import { BookIcon } from '../Icons/BookIcon';
import UserBooksPagination from '../User/UserBooksPagination';
import { GrAdd } from 'react-icons/gr';

type Props = {
  books: Book[];
  booksLoading: boolean;
  metadata: unknown;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (value: SetStateAction<number>) => void;
  setPageSize: (value: SetStateAction<number>) => void;
};


const UserProfileBooks = ({ books, booksLoading, metadata, currentPage, pageSize, setCurrentPage, setPageSize }: Props) => {
  const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
      const metadataWithTotal = metadata as { totalCount?: number };
      if (metadataWithTotal?.totalCount) {
        setTotalPages(Math.ceil(metadataWithTotal.totalCount / pageSize));
      }
    }, [metadata, pageSize]);
  
  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: SetStateAction<number>) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const metadataWithTotal = metadata as { totalCount?: number };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold mb-3 sm:mb-0">My Books</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
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
            </select>
          </div>
          <Link 
            to="/Books/Create"
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm w-full sm:w-auto text-center"
          >
            Add New Book
          </Link>
        </div>
      </div>
      
      {booksLoading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : books && books.length > 0 ? (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {books && books.map((book) => (
              <BookCard key={book.id} item={book} />
            ))}
          </div>
          
          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-2 text-center">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, metadataWithTotal?.totalCount || 0)} of {metadataWithTotal?.totalCount || 0} books
            </div>
            <UserBooksPagination 
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookIcon />
          <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't added any books yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Start building your library by adding your first book.</p>
          <Link 
            to="/Books/Create"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <GrAdd className="w-5 h-5 mr-2" />
            Add Your First Book
          </Link>
        </div>
      )}
    </div>
  );
};
export default UserProfileBooks;