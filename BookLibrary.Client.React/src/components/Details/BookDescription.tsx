export const BookDescription = ({ description }: { description: string }) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
    <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
  </div>
);