import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CategorySelect } from "../../components/CategorySelect";
import { DescriptionTextarea } from "../../components/DescriptionTextarea";
import { Input } from "../../components/Input";
import { UploadImage } from "../../components/Uploads/UploadImage";
import { UploadPdf } from "../../components/Uploads/UploadPdf";
import useCreate from "../../Hooks/Book/useCreate";
import { useCategories } from "../../Hooks/Category/useCategories";
import { handleBack } from "../../Utils/handleBack";

const Create = () => {
    const { handleChange, handleSubmit, values, errors, loading } = useCreate();
    const categories = useCategories()

    const inputFields = [
        { id: "title", name: "title", type: "text", label: "Title", placeholder: "Title" },
        { id: "author", name: "author", type: "text", label: "Author", placeholder: "Author" },
        { id: "isbn", name: "isbn", type: "text", label: "ISBN", placeholder: "ISBN" },
        { id: "publicationDate", name: "publicationDate", type: "date", label: "Publication Date" },
        { id: "numberOfPage", name: "numberOfPage", type: "number", label: "Number of Pages", placeholder: "Number of Pages" },
        { id: "genre", name: "genre", type: "text", label: "Genre", placeholder: "Genre" },
        { id: "publisher", name: "publisher", type: "text", label: "Publisher", placeholder: "Publisher" },
        { id: "language", name: "language", type: "text", label: "Language", placeholder: "Language" },
    ];

    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <ToastContainer />
            <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl border border-gray-200">
                    <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Create New Book</h1>
                        <button onClick={handleBack} className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-base sm:text-lg">Back to List</button>
                    </div>

                    <form encType="multipart/form-data" onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        {inputFields.map((field) => (
                            <Input
                                key={field.id}
                                field={field}
                                handleChange={handleChange}
                                values={{ ...values, numberOfPage: values.numberOfPage || 0 }}
                                errors={{ ...errors, numberOfPage: errors.numberOfPage?.toString() || '' }}
                            />
                        ))}
 
                        <div className="col-span-2 md:col-span-1">
                            <CategorySelect 
                                categories={categories} 
                                selectedCategoryId={values.categoryId || ''} 
                                handleChange={handleChange} 
                            />
                        </div>
                        
                        <div className="col-span-2 md:col-span-1 mb-4">
                            <div className="flex items-start sm:items-center space-x-4 p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center h-6">
                                    <input
                                        id="isPrivate"
                                        name="isPrivate"
                                        type="checkbox"
                                        checked={values.isPrivate || false}
                                        onChange={handleChange}
                                        className="h-5 w-5 sm:h-6 sm:w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="isPrivate" className="text-base sm:text-lg font-medium text-gray-700 cursor-pointer">
                                        Private Book
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-500">
                                        When enabled, this book will only be visible to you
                                    </p>
                                </div>
                            </div>
                            {errors.isPrivate && (
                                <p className="mt-2 text-sm text-red-600">{errors.isPrivate}</p>
                            )}
                        </div>


                        <UploadImage className='col-span-2 md:col-span-1' handleChange={handleChange} error={errors.image} />

                        <UploadPdf className='col-span-2 md:col-span-1' handleChange={handleChange} error={errors.pdf} />
                
                        <div className="col-span-2 md:col-span-1">
                            <DescriptionTextarea handleChange={handleChange} description={values.description || ''} error={errors.description || ''} />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <button type="submit" className="bg-indigo-600 text-white py-3 sm:py-4 px-6 sm:px-8 w-full rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-semibold text-lg sm:text-xl">
                                {loading ? 'Loading...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Create;