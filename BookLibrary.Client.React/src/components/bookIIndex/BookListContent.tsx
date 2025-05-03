import { Book } from "../../Types/book";
import BodyRow from "../BodyRow";
import BookCard from "../BookCard";
import HeadRow from "../HeadRow";
import EmptyState from "./EmptyStateProps";

export const BookListContent = ({ 
  books, 
  viewMode 
}: { 
  books: Book[], 
  viewMode: string 
}) => {
  if (books.length === 0) {
      return (
          <EmptyState 
              title="No books found" 
              message="Try adjusting your search or filter criteria." 
          />
      );
  }

  return viewMode === 'carpet' ? (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {books.map((item) => (
              <BookCard item={item} key={item.id} />
          ))}
      </div>
  ) : (
      <div className="mt-6 overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                          <HeadRow />
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                          {books.map((item, index) => (
                              <BodyRow item={item} key={item.id} index={index} />
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );
};