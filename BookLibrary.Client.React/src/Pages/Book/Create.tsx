import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../components/Input";
import UseCreate from "../../Hooks/Book/UseCreate";
import UseFetch from "../../Hooks/UseFetch";
import { Category } from "../../Types/category";

const Create = () => {
    const { error, fetchData } = UseFetch()
    const { handleChange, handleSubmit, values, errors } = UseCreate();
    const [categories, setCategories] = useState<Category[]>([]);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);

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


    console.log(errors)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            handleChange({
                target: {
                    name,
                    value: files[0]
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>);

            const file = files[0];
            if (name === "image") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else if (name === "pdf") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPdfPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

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
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl p-8">
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-extrabold text-gray-900">Create New Book</h1>
                        <Link to="/Books" className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Back to List</Link>
                    </div>

                    <form encType="multipart/form-data" onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                        {inputFields.map((field) => (
                            <Input
                                key={field.id}
                                field={field}
                                handleChange={handleChange}
                                values={{ ...values, numberOfPage: values.numberOfPage || 0 }}
                                errors={{ ...errors, numberOfPage: errors.numberOfPage?.toString() || '' }}
                            />
                        ))}

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label htmlFor="image" className="text-gray-700 block text-sm font-semibold mb-2">Image Upload</label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="image" className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Image Preview" className="mx-auto max-h-64 object-contain rounded-lg" />
                                ) : (
                                    <span className="text-gray-500">Click to upload image</span>
                                )}
                            </label>
                            <span className="text-red-600 text-sm block mt-2">{errors.image}</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label htmlFor="pdf" className="text-gray-700 block text-sm font-semibold mb-2">PDF Upload</label>
                            <input
                                id="pdf"
                                name="pdf"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="pdf" className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
                                {pdfPreview ? (
                                    <iframe
                                        src={pdfPreview}
                                        title="PDF Preview"
                                        className="w-full h-64 rounded-lg"
                                    ></iframe>
                                ) : (
                                    <span className="text-gray-500">Click to upload PDF</span>
                                )}
                            </label>
                            <span className="text-red-600 text-sm block mt-2">{errors.pdf}</span>
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="text-gray-700 block text-sm font-semibold mb-2">Category</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                onChange={handleChange}
                                value={values.categoryId}
                                className="mt-1 border-gray-300 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Select Category</option>
                                {categories && categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            <span className="text-red-600 text-sm">{errors.categoryId}</span>
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="description" className="text-gray-700 block text-sm font-semibold mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                onChange={handleChange}
                                value={values.description}
                                className="mt-1 border-gray-300 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Description"
                            ></textarea>
                            <span className="text-red-600 text-sm">{errors.description}</span>
                        </div>

                        <div className="col-span-2">
                            <button type="submit" className="bg-indigo-600 text-white py-3 px-6 w-full rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-semibold">
                                Create Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Create;