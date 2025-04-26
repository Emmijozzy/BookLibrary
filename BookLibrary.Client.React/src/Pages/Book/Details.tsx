import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UseFetch from "../../Hooks/UseFetch";
import { Book } from "../../Types/book";
import { FaDownload, FaFilePdf, FaArrowLeft, FaEdit } from "react-icons/fa";

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
        imageUrl: '',
        pdfUrl: ''
    });
    const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

    const { error, fetchData } = UseFetch();

    useEffect(() => {
        const getBook = async () => {
            setDataLoading(true);
            await fetchData<Book>("Book/" + id, { method: 'get' })
                .then((fetchedData) => {
                    if (fetchedData) {
                        setBook(fetchedData);
                    }
                })
                .catch(err => {
                    console.log(error);
                    console.error('There was an error fetching the book!', err);
                })
                .finally(() => {
                    setDataLoading(false);
                });
        };
        getBook();
    }, [id, error, fetchData]);

    const togglePdfPreview = () => {
        setPdfPreviewOpen(!pdfPreviewOpen);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Function to handle PDF download
    const handlePdfDownload = () => {
        if (book.id) {
            // Use the proxy endpoint with the book ID
            window.open(`https://localhost:7257/api/File/proxy/${book.id}?type=pdf`, '_blank');
        }
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
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Book Header with Cover Image */}
                    <div className="relative h-80 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Book Cover */}
                                <div className="w-48 h-64 flex-shrink-0 overflow-hidden rounded-lg shadow-2xl border-4 border-white">
                                    <img 
                                        src={book.id ? `https://localhost:7257/api/File/proxy/${book.id}?type=image` : `https://picsum.photos/seed/${book.id}/200/300`}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error("Error loading image, falling back to placeholder");
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://picsum.photos/seed/${book.id || 'default'}/200/300`;
                                        }}
                                    />
                                </div>
                                
                                {/* Book Title and Author */}
                                <div className="text-center md:text-left text-white">
                                    <h1 className="text-3xl font-bold">{book.title}</h1>
                                    <p className="text-xl mt-2">by {book.author}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                                            {book.genre}
                                        </span>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                                            {book.language}
                                        </span>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                                            {book.numberOfPage} pages
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Book Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left Column - Book Metadata */}
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{book.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
                                        <p className="mt-1 text-gray-800">{book.isbn}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Publication Date</h3>
                                        <p className="mt-1 text-gray-800">{formatDate(book.publicationDate)}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Publisher</h3>
                                        <p className="mt-1 text-gray-800">{book.publisher}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Language</h3>
                                        <p className="mt-1 text-gray-800">{book.language}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column - PDF and Actions */}
                            <div className="space-y-6">
                                {/* PDF Preview Card */}
                                {book.pdfUrl && (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                            <FaFilePdf className="mr-2 text-red-500" />
                                            PDF Document
                                        </h3>
                                        
                                        <div className="flex flex-col space-y-3">
                                            <button 
                                                onClick={handlePdfDownload}
                                                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
                                            >
                                                <FaDownload className="mr-2" />
                                                Download PDF
                                            </button>
                                            
                                            <button 
                                                onClick={togglePdfPreview}
                                                className="w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition flex items-center justify-center"
                                            >
                                                {pdfPreviewOpen ? 'Hide Preview' : 'Show Preview'}
                                            </button>
                                            
                                            {pdfPreviewOpen && book.id && (
                                                <div className="mt-4 border border-gray-300 rounded-md overflow-hidden h-96">
                                                    <object
                                                        data={`https://localhost:7257/api/File/proxy/${book.id}?type=pdf`}
                                                        type="application/pdf"
                                                        className="w-full h-full"
                                                    >
                                                        <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
                                                            <p className="text-gray-600 mb-4">Unable to display PDF preview.</p>
                                                            <a 
                                                                href={`https://localhost:7257/api/File/proxy/${book.id}?type=pdf`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    </object>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col space-y-3">
                                    <Link 
                                        to={`/Books/Edit/${book.id}`}
                                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
                                    >
                                        <FaEdit className="mr-2" />
                                        Edit Book
                                    </Link>
                                    
                                    <Link 
                                        to="/Books"
                                        className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center justify-center"
                                    >
                                        <FaArrowLeft className="mr-2" />
                                        Back to List
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;