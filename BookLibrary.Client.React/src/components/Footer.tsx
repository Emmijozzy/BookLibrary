const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto h-auto min-h-16">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-600 text-sm sm:text-base">
        <span className="text-center">&copy; 2025 - Book Library - All Rights Reserved</span>
        <span className="flex items-center">
          Built by Emmijozzy <span className="text-red-500 ml-1">❤</span>
        </span>
      </div>
    </footer>
  )
}
export default Footer