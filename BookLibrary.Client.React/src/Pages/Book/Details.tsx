import { ArrowLeftIcon, BookOpenIcon, CalendarIcon, LockClosedIcon, LockOpenIcon, UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookActions } from "../../components/Details/BookActions";
import { BookCover } from "../../components/Details/BookCover";
import { BookDescription } from "../../components/Details/BookDescription";
import { BookHeader } from "../../components/Details/BookHeader";
import { BookMetadata } from "../../components/Details/BookMetadata";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PdfPreview } from "../../components/PdfPreview";
import { useBookData } from "../../Hooks/Book/Details/useBookData";
import { useApp } from "../../Hooks/useApp";
import useFetch from "../../Hooks/useFetch";
import { User } from "../../Types/User";
import { formatDate } from "../../Utils/formatDate";
import { handleBack } from "../../Utils/handleBack";

const Details = () => {
    const { id } = useParams();
    const { book, dataLoading } = useBookData(id);
    const { appUserId, currentRole } = useApp();
    const { fetchData, data, loading, error} = useFetch()

    const isOwner = appUserId === book.createdBy;
    const isAdmin = currentRole === 'Admin';
    const canEdit = isAdmin || isOwner;

    const [creator, setCreator] = useState<User | null>(null);

    // Fetch creator details if createdBy is available
    useEffect(() => {
      const fetchCreator = async () => {
        if (!book.createdBy) return;
        
        try {
            await fetchData(`User/${book.createdBy}`, { method: 'get' });          
          if (data) {
            setCreator(data as User);
          }
        } catch  {
          console.error("Error fetching creator details:", error);
        }
      };

      if (book.createdBy) {
        fetchCreator();
      }
    }, [book.createdBy]);

    if (dataLoading) {
      return <LoadingSpinner />;
    }

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 text-gray-500" />
            Back
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-[30rem] md:h-96 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <BookCover book={book} />
                  <div className="flex flex-col items-center md:items-start">
                    <BookHeader book={book} />
                    
                    {/* Privacy Badge */}
                    <div className="mt-3 flex items-center">
                      {book.isPrivate ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 bg-opacity-75 text-white">
                          <LockClosedIcon className="h-4 w-4 mr-1" />
                          Private Book
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-800 bg-opacity-75 text-white">
                          <LockOpenIcon className="h-4 w-4 mr-1" />
                          Public Book
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-8">
                  <BookDescription description={book.description} />
                  
                  {/* Book Details Card */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <BookOpenIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        Book Details
                      </h3>
                    </div>
                    <div className="p-6">
                      <BookMetadata book={book} formatDate={formatDate} />
                    </div>
                  </div>
                  
                  {/* Creator Information */}
                  {book.createdBy && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                          <UserIcon className="h-5 w-5 mr-2 text-indigo-500" />
                          Added By
                        </h3>
                      </div>
                      <div className="p-6">
                        {loading ? (
                          <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        ) : creator ? (
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                              {creator.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">{creator.fullName}</h4>
                              <p className="text-sm text-gray-500">{creator.email}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">User information not available</p>
                        )}
                        
                        {book.createdAt && (
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Added on {formatDate(book.createdAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="lg:w-1/3 space-y-6">
                  {/* Actions Card */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-4">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                    </div>
                    <div className="p-6">
                      {book.id && <BookActions bookId={book.id} canEdit={canEdit} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* PDF Preview Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">PDF Preview</h3>
            </div>
            <div className="p-6">
              {book.id ? (
                <PdfPreview bookId={book.id} />
              ) : (
                <p className="text-gray-500 text-center py-8">PDF preview not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default Details;
