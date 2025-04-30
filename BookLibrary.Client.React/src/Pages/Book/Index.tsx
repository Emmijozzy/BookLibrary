import { useEffect, useState } from "react";
import { FaList, FaThLarge } from "react-icons/fa";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import { Book } from "../../Types/book";
import BodyRow from "../../components/BodyRow";
import BookCard from "../../components/BookCard";
import HeadRow from "../../components/HeadRow";
import SearchBook from "../../components/SearchBook";

const Index = () => {
    const { data, error, fetchData } = useFetch()
    const [loading, setLoading] = useState(false)
    const [viewMode, setViewMode] = useState('carpet')
    const [searchTerm, setSearchTerm] = useState('')
    const [searchField, setSearchField] = useState('title')

    let content;

    useEffect(() => {
        const getBook = async () => {
            setLoading(true)
            await fetchData("Book/all", { method: 'get' })
            setLoading(false)
        }
        getBook();

    }, [fetchData])

    // console.log(data,"data")

    const filterBooks = (books: Book[]) => {
        return books.filter(book => {
            const value = book[searchField as keyof Book];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    if (loading) {
        content = <div>Loading...</div>;
    } else if (error) {
        content = <div>Error: {error as string}</div>;
    } else if (data && Object.keys(data).length >= 1) {
        const books = data as unknown as Book[];
        const filteredBooks = filterBooks(books);
        content = (
            <>
                <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900">Book List</h1>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">Library Collection</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setViewMode('carpet')}
                                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ease-in-out ${viewMode === 'carpet' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                <FaThLarge className="text-lg" /> Grid View
                            </button>
                            <button 
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ease-in-out ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                <FaList className="text-lg" /> Table View
                            </button>
                        </div>
                        <Link 
                            to="/Books/create" 
                            className="inline-flex items-center justify-center rounded-lg py-2.5 px-5 text-sm font-medium transition-all duration-200 ease-in-out bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="mr-2">Add New Book</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        </Link>
                    </div>
                </div>
                <SearchBook setSearchTerm={setSearchTerm} setSearchField={setSearchField} searchTerm={searchTerm} searchField={searchField} />

                {viewMode === 'carpet' ? (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredBooks.map((item) => (
                            <BookCard item={item} key={item.id} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <HeadRow />
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {filteredBooks.map((item, index) => (
                                            <BodyRow item={item} key={item.id} index={index} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        content = <div>No data available</div>;
    }

    return content
}
export default Index