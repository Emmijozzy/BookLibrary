import { Link } from "react-router-dom"
import { Book } from "../Types/book"

type Props = {
  item: Book
}

const BookCard = ({ item }: Props) => {
  return (
    <div key={item.id} className="w-full  bg-white rounded-xl shadow-lg p-4 sm:p-5 hover:shadow-xl transition-shadow duration-300">
        <div className="relative overflow-hidden rounded-lg">
            <img 
                src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/600`} 
                alt={item.title}
                className="w-full h-48 sm:h-56 object-cover transform hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="mt-4">
            <h3 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2 text-gray-800">{item.title}</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-1 font-medium">By {item.author}</p>
            <p className="text-sm sm:text-base text-gray-500 mb-4 italic">{item.genre}</p>
            <div className="w-full flex flex-col sm:flex-row gap-3 justify-between text-sm sm:text-base">
                <Link to={`/Books/Edit/${item.id}`} className="w-full sm:flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-center">Edit</Link>
                <Link to={`/Books/Details/${item.id}`} className="w-full sm:flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-center">Details</Link>
                <Link to={`/Books/Delete/${item.id}`} className="w-full sm:flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-center">Delete</Link>                    
            </div>
        </div>
    </div>  
    )
}
export default BookCard