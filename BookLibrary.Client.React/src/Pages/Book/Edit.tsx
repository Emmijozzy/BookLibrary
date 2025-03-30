import { Link } from "react-router-dom";
import UseEdit from "../../Hooks/Book/UseEdit";
import { Input } from "../../components/Input";
import { useState, useEffect } from "react";
import UseFetch from "../../Hooks/UseFetch";
import { Category } from "../../Types/category";

const Edit = () => {
    const { error, fetchData } = UseFetch()   
    const { handleChange, handleSubmit, values, errors, dataLoading } = UseEdit();
    const [categories, setCategories] = useState<Category[]>([]);
    
        useEffect(() => {
            const getCategories = async () => {
                await fetchData("Category/all?includeProperties=Books", { method: 'get' })
                .then((fetchedData) => {
                    if (!fetchedData) return;
                    setCategories(fetchedData as unknown as Category[]);
                })
                .catch(err => {
                    console.log(error)
                    console.error('There was an error fetching the book!', err);
                })
            }
            getCategories();
        }, [error, fetchData])

    
    const inputFields = [
        { id: "title", name: "title", type: "text", label: "Title", placeholder: "Title" },
        { id: "author", name: "author", type: "text", label: "Author", placeholder: "Author" },
        { id: "isbn", name: "isbn", type: "text", label: "ISBN", placeholder: "ISBN" },
        { id: "publicationDate", name: "publicationDate", type: "date", label: "Publication Date" },
        { id: "numberOfPage", name: "numberOfPage", type: "number", label: "Number of Pages", placeholder: "Number of Pages" },
        { id: "genre", name: "genre", type: "text", label: "Genre", placeholder: "Genre" },
        { id: "publisher", name: "publisher", type: "text", label: "Publisher", placeholder: "Publisher" },
        { id: "language", name: "language", type: "text", label: "Language", placeholder: "Language" },
        { id: "imageUrl", name: "imageUrl", type: "file", label: "Image Upload" }
    ];

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
                        <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
                        <Link to="/Books" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700">Back to List</Link>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        {inputFields.map((field) => (
                            <Input 
                                key={field.id} 
                                field={field} 
                                handleChange={handleChange} 
                                values={{...values, numberOfPage: values.numberOfPage || 0}} 
                                errors={{...errors, numberOfPage: errors.numberOfPage?.toString() || ''}}
                            />
                        ))}
        
                         <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                onChange={handleChange}
                                value={values.categoryId}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Select Category</option>
                                {categories &&  categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
        
                        <div className="col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                onChange={handleChange}
                                value={values.description}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Description"
                            ></textarea>
                            <span className="text-red-600 text-sm">{errors.description}</span>
                        </div>

                        <div className="col-span-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Edit