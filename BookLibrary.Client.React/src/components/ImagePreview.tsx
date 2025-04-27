import { useState } from "react";
import { FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
import { API_BASE_URL } from "../constants";

export const ImagePreview = ({ bookId }: { bookId?: string }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!bookId) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
        <FaImage className="mr-2 text-blue-500" />
        Current Book Cover
      </h3>
      
      <div className="flex flex-col space-y-3">
        <button 
          onClick={() => setPreviewOpen(!previewOpen)}
          className="w-full py-3 px-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
        >
          {previewOpen ? <><FaEyeSlash className="mr-2" /> Hide Cover</> : <><FaEye className="mr-2" /> Show Cover</>}
        </button>
        
        {previewOpen && (
          <div className="mt-4 flex justify-center">
            <div className="w-56 h-72 overflow-hidden rounded-lg shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300">
              <img 
                src={`${API_BASE_URL}/File/proxy/${bookId}?type=image`}
                alt="Book Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading image, falling back to placeholder");
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/${bookId || 'default'}/200/300`;
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};