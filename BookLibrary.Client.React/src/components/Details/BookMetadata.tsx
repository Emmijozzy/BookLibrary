import { Book } from "../../Types/book";
import { BookMetadataItem } from "./BookMetadataItem";

export const BookMetadata = ({ book, formatDate }: { book: Book; formatDate: (date: string) => string }) => (
  <div className="grid grid-cols-2 gap-6">
    <BookMetadataItem label="ISBN" value={book.isbn} />
    <BookMetadataItem label="Publication Date" value={formatDate(book.publicationDate)} />
    <BookMetadataItem label="Publisher" value={book.publisher} />
    <BookMetadataItem label="Language" value={book.language} />
  </div>
);
