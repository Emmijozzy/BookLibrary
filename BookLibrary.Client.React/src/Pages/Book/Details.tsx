import { useParams } from "react-router-dom";
import { useBookData } from "../../Hooks/Book/Details/useBookData";
import { formatDate } from "../../Utils/formatDate";
import { BookActions } from "../../components/Details/BookActions";
import { BookDescription } from "../../components/Details/BookDescription";
import { BookHeader } from "../../components/Details/BookHeader";
import { BookMetadata } from "../../components/Details/BookMetadata";
import { PdfPreview } from "../../components/PdfPreview";
import { BookCover } from "../../components/Details/BookCover";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const Details = () => {
    const { id } = useParams();
    const { book, dataLoading } = useBookData(id);

    if (dataLoading) {
      return <LoadingSpinner />;
    }

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-[30rem] md:h-96 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <BookCover book={book} />
                  <BookHeader book={book} />
                </div>
              </div>
            </div>
          
            <div className="p-8 ">
              <div className="block">
                <div className="space-y-8">
                  <BookDescription description={book.description } />
                  <BookMetadata book={book} formatDate={formatDate} />
                </div>
              
                <div className="mt-6 space-y-6">
                
                  {book.id && <BookActions bookId={book.id} />}
                </div>
              </div>
            </div>

          </div>
            <div className="space-y-6 py-6">
            {book.id && (
                <>
                    <PdfPreview bookId={book.id} />
                </>
            )}
            </div>
        </div>
      </div>
    );
};

export default Details;
