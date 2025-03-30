import { Link } from "react-router-dom"
import { Book } from "../Types/book"

type Props = {
  item: Book
}

const BookCard = ({ item }: Props) => {
  return (
    <div key={item.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4">
    <img 
        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/200/300`} 
        alt={item.title}
        className="w-full h-40 sm:h-48 object-cover rounded-md mb-4"
    />
    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{item.title}</h3>
    <p className="text-xs sm:text-sm text-gray-600 mb-1">By {item.author}</p>
    <p className="text-xs sm:text-sm text-gray-600 mb-3">{item.genre}</p>
    <div className="flex gap-2 text-xs sm:text-sm">
      <Link to={`/Books/Edit/${item.id}`} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</Link>
      <Link to={`/Books/Details/${item.id}`} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Details</Link>
      <Link to={`/Books/Delete/${item.id}`} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</Link>                   
    </div>
</div>
  )
}

export default BookCard