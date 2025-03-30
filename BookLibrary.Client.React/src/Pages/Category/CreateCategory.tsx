import { Link } from "react-router-dom";
import { Input } from "../../components/Input";
import { useCreate } from "../../Hooks/Category/useCreate";

const CreateCategory = () => {
   const { handleChange, handleSubmit, values, errors } = useCreate();
  
      const inputFields = [
          { id: "name", name: "name", type: "text", label: "Name", placeholder: "Name" },
          { id: "description", name: "description", type: "text", label: "Description", placeholder: "Description" },
      ];

  return (
    <div className="min-h-screen bg-gray-100">
            <div className="flex-1 p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Book</h1>
                        <Link to="/categories" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700">Back to List</Link>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                      <Input field={inputFields[0]} handleChange={handleChange} values={values} errors={errors} bodyClassName="col-span-2" />

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
                                Create Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default CreateCategory