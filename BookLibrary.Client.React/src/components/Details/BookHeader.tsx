import { Book } from "../../Types/book";

export const BookHeader = ({ book }: { book: Book }) => (
    <div className="text-center md:text-left text-white">
      <h1 className="text-4xl font-bold text-shadow-lg">{book.title}</h1>
      <p className="text-2xl mt-3 opacity-90">by {book.author}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm hover:bg-white/40 transition-colors">
          {book.genre}
        </span>
        <span className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm hover:bg-white/40 transition-colors">
          {book.language}
        </span>
        <span className="px-4 py-2 bg-white/30 rounded-full text-sm backdrop-blur-sm hover:bg-white/40 transition-colors">
          {book.numberOfPage} pages
        </span>
      </div>
    </div>
);