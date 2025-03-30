import { Link } from "react-router-dom"
import { Book } from "../Types/book"

type Props = {
  item: Book
  index: number
}

const BodyRow = ({item, index}: Props) => {
  return (
    <tr key={item.id}>
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{index + 1}</td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
          <img 
              src={item.imageUrl || `https://picsum.photos/seed/${item.id}/50/50`} 
              alt={item.title}
              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
          />
      </td>
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.title}</td>
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.author}</td>
      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.isbn}</td>
      <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.publicationDate}</td>
      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.numberOfPage}</td>
      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.genre}</td>
      <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.publisher}</td>
      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm whitespace-nowrap">{item.language}</td>
      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to={`/Books/Edit/${item.id}`} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</Link>
            <Link to={`/Books/Details/${item.id}`} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Details</Link>
            <Link to={`/Books/Delete/${item.id}`} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</Link>                              
          </div>
      </td>
    </tr>
  )
}

export default BodyRow