import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UseFetch from '../../Hooks/UseFetch';
import { Category } from '../../Types/category';

  const ViewCategoryDetails = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const { data, error, fetchData } = UseFetch();
      const [loading, setLoading] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
          const getCategory = async () => {
              setLoading(true);
              await fetchData(`Category/${id}?includeProperties=Books`, { method: 'get' });
              setLoading(false);
          };
          getCategory();
      }, [fetchData, id]);

      if (loading) {
          return <div>Loading...</div>;
      }

      if (error) {
          return <div>Error: {error as string}</div>;
      }

      if (!data) {
          return <div>No category found</div>;
      }

      const category = data as unknown as Category;

      const filteredBooks = category.books?.filter(book => 
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
                          <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                              <img
                                  src={book.imageUrl || `https://picsum.photos/seed/${book.id}/400/300`}
                                  alt={book.title}
                                  className="w-full h-48 object-cover"
                                  onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(book.title)}`;
                                  }}
                              />
                              <div className="p-6 flex flex-col flex-grow">
                                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                                  <p className="text-gray-600 mb-4">{book.description}</p>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                          <p className="text-gray-500">Author</p>
                                          <p>{book.author}</p>
                                      </div>
                                      <div>
                                          <p className="text-gray-500">Genre</p>
                                          <p>{book.genre}</p>
                                      </div>
                                      <div>
                                          <p className="text-gray-500">Publisher</p>
                                          <p>{book.publisher}</p>
                                      </div>
                                      <div>
                                          <p className="text-gray-500">Language</p>
                                          <p>{book.language}</p>
                                      </div>
                                      <div>
                                          <p className="text-gray-500">ISBN</p>
                                          <p>{book.isbn}</p>
                                      </div>
                                      <div>
                                          <p className="text-gray-500">Pages</p>
                                          <p>{book.numberOfPage}</p>
                                      </div>
                                      <div>
                                          <p className="text-gray-500">Publication Date</p>
                                          <p>{book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : 'N/A'}</p>
                                      </div>
                                  </div>
                              </div>
                              <div className="p-4 bg-gray-50 border-t flex justify-end space-x-4">
                                  <Link to={`/Books/Edit/${book.id}`} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</Link>
                                  <Link to={`/Books/Details/${book.id}`} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Details</Link>
                                  <Link to={`/Books/Delete/${book.id}`} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</Link>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  };
  export default ViewCategoryDetails;