import { Book } from "../../Types/book";
import BookCard from "../BookCard";

interface BookGridProps {
  books: Book[]
}

const BookGrid = ({ books }: BookGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} item={book} />
      ))}
    </div>
  )
}

export default BookGrid