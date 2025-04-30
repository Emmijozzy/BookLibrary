import { Book } from "../../Types/book";

const API_BASE_URL = "https://localhost:7257/api";

export const BookCover = ({ book }: { book: Book }) => (
    <div className="w-56 h-72 flex-shrink-0 overflow-hidden rounded-lg shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300">
      <img 
        src={book.id ? `${API_BASE_URL}/File/proxy/${book.id}?type=image` : `https://picsum.photos/seed/${book.id}/200/300`}
        alt={book.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Error loading image, falling back to placeholder");
          const target = e.target as HTMLImageElement;
          target.src = `https://picsum.photos/seed/${book.id || 'default'}/200/300`;
        }}
      />
    </div>
);