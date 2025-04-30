export const BookMetadataItem = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <p className="mt-2 text-gray-800 font-medium">{value}</p>
    </div>
);