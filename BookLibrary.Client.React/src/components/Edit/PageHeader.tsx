import { handleBack } from "../../Utils/handleBack";

export const PageHeader = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
    <button onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700">
      Back to List
    </button>
  </div>
);