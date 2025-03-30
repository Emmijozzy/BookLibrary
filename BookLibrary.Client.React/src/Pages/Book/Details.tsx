import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UseFetch from "../../Hooks/UseFetch";
import { Book } from "../../Types/book";

const Details = () => {
    const [dataLoading, setDataLoading] = useState(false);
    const { id } = useParams();
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
        language: '',
        imageUrl: ''
    });

    const { error, fetchData } = UseFetch()

    useEffect(() => {
        const getBook = async () => {
            setDataLoading(true);
            await fetchData<Book>("Book/" + id, { method: 'get' })
                .then((fetchedData) => {
                    if (fetchedData)
                        setBook(fetchedData);
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
    }, [id, error, fetchData]);

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
                        <h1 className="text-2xl font-bold text-gray-900">Book Details</h1>
                        <Link to="/Books" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700">Back to List</Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 flex justify-center mb-6">
                            <div className="w-full max-w-md overflow-hidden">
                                <img 
                                    src={book.imageUrl || `https://picsum.photos/seed/${book.id}/200/300`} 
                                    alt={book.title}
                                    className="w-full h-[400px] object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://picsum.photos/seed/${book.id}/200/300`;
                                    }}
                                />
                            </div>
                        </div>
                        {[
                            { label: 'Title', value: book.title },
                            { label: 'Author', value: book.author },
                            { label: 'ISBN', value: book.isbn },
                            { label: 'Publication Date', value: book.publicationDate },
                            { label: 'Description', value: book.description, span: 2, minHeight: true },
                            { label: 'Number of Pages', value: book.numberOfPage },
                            { label: 'Genre', value: book.genre },
                            { label: 'Publisher', value: book.publisher },
                            { label: 'Language', value: book.language }
                        ].map((field, index) => (
                            <div key={index} className={field.span ? 'col-span-2' : ''}>
                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                <div className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 ${field.minHeight ? 'min-h-[100px]' : ''}`}>
                                    {field.value}
                                </div>
                            </div>
                        ))}

                        <div className="col-span-2 flex gap-4">
                            <Link 
                                to={`/Books/Edit/${book.id}`}
                                className="w-1/2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
                            >
                                Edit
                            </Link>
                            <Link 
                                to="/Books"
                                className="w-1/2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center"
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details