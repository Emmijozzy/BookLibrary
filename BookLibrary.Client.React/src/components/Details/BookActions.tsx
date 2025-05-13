import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { handleBack } from "../../Utils/handleBack";

export const BookActions = ({ bookId }: { bookId: string }) => (
  <div className="flex space-x-6">
    <Link 
      to={`/Books/Edit/${bookId}`}
      className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
    >
      <FaEdit className="mr-2" />
      Edit Book
    </Link>
  
    <button 
      onClick={handleBack}
      className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
    >
      <FaArrowLeft className="mr-2" />
      Back to List
    </button>
  </div>
);