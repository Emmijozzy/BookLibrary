import { Link } from "react-router-dom";

type BookActionsProps = {
  bookId: string;
  canEdit?: boolean;
};

export const BookActions = ({ bookId, canEdit = true }: BookActionsProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <Link 
        to={`/Books/Download/${bookId}`} 
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-center font-medium"
      >
        Download PDF
      </Link>
      
      {canEdit && (
        <>
          <Link 
            to={`/Books/Edit/${bookId}`} 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-center font-medium"
          >
            Edit Book
          </Link>
          
          <Link 
            to={`/Books/Delete/${bookId}`} 
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 text-center font-medium"
          >
            Delete Book
          </Link>
        </>
      )}
    </div>
  );
};