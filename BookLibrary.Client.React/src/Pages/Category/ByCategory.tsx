import { useEffect, useState } from 'react'
import { FaList, FaThLarge } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Loading from '../../components/Loading'
import SearchBar from '../../components/SearchBar'
import useFetch from '../../Hooks/useFetch'
import { Category } from '../../Types/category'

const ByCategory = () => {
  const { data, error, fetchData, loading } = useFetch()
  const [viewMode, setViewMode] = useState('carpet')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('name')

  let content;

  useEffect(() => {
      const getCategories = async () => {
        //   await fetchData("Category/all?includeProperties=Books", { method: 'get' })
          await fetchData("Category/all-with-user-books", { method: 'get' })
      }
      getCategories();
  }, [fetchData])

  const filterCategories = (categories: Category[]) => {
      return categories.filter(category => {
          const value = category[searchField.toLowerCase() as keyof Category];
          if (typeof value === 'string') {
              return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
  }

  if (loading) {
      content = <Loading />;
  } else if (error) {
      content = <div>Error: {error as string}</div>;
  } else if (data && Object.keys(data).length >= 1) {
      const categories = data as unknown as Category[];
      const filteredCategories = filterCategories(categories);
      content = (
          <>
              <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-lg shadow-sm mb-2">
                  <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">Library Categories</span>
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
                          to="/categories/create" 
                          className="inline-flex items-center justify-center rounded-lg py-2.5 px-5 text-sm font-medium transition-all duration-200 ease-in-out bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                          <span className="mr-2">Add New Category</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                          </svg>
                      </Link>
                  </div>
              </div>
              <SearchBar setSearchTerm={setSearchTerm} setSearchField={setSearchField} searchTerm={searchTerm} searchField={searchField} searchOptions={[ "Name", "Description"]} />

              {viewMode === 'carpet' ? (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-4">
                      {filteredCategories.map((category) => (
                          <div key={category.id} className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
                            <div className="flex-grow">
                              <h3 className="text-lg font-semibold">{category.name}</h3>
                              <p className="text-gray-600">{category.description}</p>
                              <p className="text-sm text-gray-500 mt-2">Books: {category.books?.length}</p>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <Link to={`/categories/Details/${category.id}`}  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Details</Link>
                                <Link to={`/categories/edit/${category.id}`} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</Link>
                                <Link to={`/categories/Delete/${category.id}`} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</Link>
                            </div>
                          </div>
                      ))}
                  </div>              ) : (
                  <div className="mt-6 overflow-x-auto">
                      <div className="min-w-full inline-block align-middle">
                          <div className="overflow-hidden">
                              <table className="min-w-full divide-y divide-slate-200">
                                  <thead className="bg-slate-50">
                                      <tr>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th> */}
                                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Books Count</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-slate-200">
                                      {filteredCategories.map((category) => (
                                          <tr key={category.id}>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{category.name}</td>
                                              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category.description}</td> */}
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{category.books?.length}</td>
                                              <td className="flex gap-3 px-6 py-4 whitespace-nowrap text-sm text-slate-500">                                              
                                                <Link to={`/categories/Details/${category.id}`} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</Link>
                                                <Link to={`/categories/Details/${category.id}`}  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Details</Link>
                                                <Link to={`/categories/Delete/${category.id}`} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</Link>
                                            </td>
                                          </tr>
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
      content = <div>No categories available</div>;
  }

  return content
}


export default ByCategory