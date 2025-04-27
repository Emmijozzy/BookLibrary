export const DescriptionTextarea = ({ 
  description, 
  error, 
  handleChange 
}: { 
  description: string;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div className="col-span-2">
    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
      Description
    </label>
    <textarea
      id="description"
      name="description"
      rows={4}
      onChange={handleChange}
      value={description || ""}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      placeholder="Description"
    ></textarea>
    <span className="text-red-600 text-sm">{error}</span>
  </div>
);
