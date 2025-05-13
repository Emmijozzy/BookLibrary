import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../Hooks/useApp';
import useFetch from '../../Hooks/useFetch';
import { Category } from '../../Types/category';
import BookCard2 from '../../components/BookCard2';
import ErrorMsg from '../../components/ErrorMsg';
import { LoadingSpinner } from '../../components/LoadingSpinner';

  const ViewCategoryDetails = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const { data, error, fetchData, loading } = useFetch();
      const [searchTerm, setSearchTerm] = useState('');
      const { currentRole } = useApp()
      const isAdmin = currentRole === 'Admin';
      

      useEffect(() => {
          const getCategory = async () => {
              if (isAdmin) {
                  await fetchData(`Category/${id}?includeProperties=Books`, { method: 'get' });
              } else {
              await fetchData(`Category/${id}/users-public-books`, { method: 'get' });
              }
          };
          getCategory();
      }, [fetchData, id]);

      if (loading) {
          return <LoadingSpinner />
      }

      const category = data as unknown as Category;

      const filteredBooks = category?.books?.filter(book => 
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
          <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-4">
                  <button
                      onClick={() => navigate(-1)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                      ← Back
                  </button>
                  <button
                      onClick={() => navigate(`/categories/edit/${id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                      Edit Category
                  </button>
              </div>

              {error && (
                <ErrorMsg error={error} />
              )}

              {category && (
                <>
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Created At</p>
                                <p>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Updated At</p>
                                <p>{category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
    
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
    
                    <h2 className="text-2xl font-bold mb-4">Books in this Category</h2>
                    {(!filteredBooks || filteredBooks.length === 0) ? (
                        <div className="text-center text-gray-500 py-8">No books found in this category</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBooks.map((book) => (
                                <BookCard2 key={book.id} book={book} />
                            ))}
                        </div>
                    )}
                </>
              )}
          </div>
      );  };
  export default ViewCategoryDetails;