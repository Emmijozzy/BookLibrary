import { Book } from "../../Types/book";
import BookGrid from "./BookGrid";
import BookTable from "./BookTable";
import EmptyState  from "./EmptyState";

export const BookListContent = ({ 
    books, 
    viewMode 
}: { 
    books: Book[], 
    viewMode: string 
}) => {
    if (books.length === 0) {
      return <EmptyState />
    }

    return (
      <div className="space-y-6 my-6">
        {viewMode === 'carpet' || viewMode === 'grid' ? (
          <BookGrid books={books} />
        ) : (
          <BookTable books={books} />
        )}
      </div>
    )
}