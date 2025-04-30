import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import { Book } from "../../Types/book";
import ErrorMsg from "../../components/ErrorMsg";

const Delete = () => {
  const [dataLoading, setDataLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>({
      id: '',
      title: '',
      author: '',
      isbn: '',
      publicationDate: '',
      description: '',
      numberOfPage: 0,
      genre: '',
      publisher: '',
      language: ''
  });

  const  {error, fetchData } = useFetch()

  useEffect(() => {
    const getBook = async () => {
      setDataLoading(true);
      await fetchData<Book>("Book/"+id , { method: 'get'})
      .then((initialData) => {
        if (initialData) setBook(initialData)
      })
      .catch(err => {
          console.log(error)
          console.error('There was an error fetching the book!', err);
      })
      .finally(() => {
          setDataLoading(false);
      })
    }
    getBook();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    const deleteBook = async () => {
      await fetchData("Book/delete/"+id , { method: 'delete'})
          .then(() => {
              navigate('/books');
          })
          .catch(error => {
              console.error('There was an error deleting the book!', error);
          });
    }

    deleteBook();

  };
  if (dataLoading) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-2xl text-gray-600">Loading...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-red-600">Delete Book</h1>
                <Link to="/Books" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700">Back to List</Link>
            </div>

            {error && (
                <ErrorMsg error={error} />
            )}

            <div className="grid grid-cols-2 gap-6">
                {[
                    { label: 'Title', value: book.title },
                    { label: 'Author', value: book.author },
                    { label: 'ISBN', value: book.isbn },
                    { label: 'Publication Date', value: book.publicationDate },
                    { label: 'Description', value: book.description, span: 2 },
                    { label: 'Number of Pages', value: book.numberOfPage },
                    { label: 'Genre', value: book.genre },
                    { label: 'Publisher', value: book.publisher },
                    { label: 'Language', value: book.language }
                ].map((item, index) => (
                    <div key={index} className={item.span ? `col-span-${item.span}` : ''}>
                        <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                        <p className="mt-1 text-gray-900">{item.value}</p>
                    </div>
                ))}

                <div className="col-span-2">
                    <button onClick={handleDelete} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>);
}
export default Delete

/* 

*/