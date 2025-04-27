import { FaExpand, FaCompress, FaTimes } from "react-icons/fa";

// Constants
const API_BASE_URL = "https://localhost:7257/api";

// Types
export interface PdfViewerProps {
    bookId: string;
    isFullScreen: boolean;
    onToggleFullScreen: () => void;
    onClose: () => void;
}

const PdfViewer = ({ bookId, isFullScreen, onToggleFullScreen, onClose }: PdfViewerProps) => (
    <div className={`relative ${isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className="absolute top-4 right-4 z-[1001] flex gap-2">
        <button 
          onClick={onToggleFullScreen}
          className="p-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
        >
          {isFullScreen ? <FaCompress /> : <FaExpand />}
        </button>
        {isFullScreen && (
          <button 
            onClick={onClose}
            className="p-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            title="Close Preview"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <object
        data={`${API_BASE_URL}/File/proxy/${bookId}?type=pdf`}
        type="application/pdf"
        className={`w-full ${isFullScreen ? 'h-screen' : 'h-[calc(100vh-24rem)]'} rounded-lg shadow-xl`}
        style={{
          ...(isFullScreen ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            border: 'none',
            zIndex: 1000
          } : {}),
        }}
      >
        <embed
          src={`${API_BASE_URL}/File/proxy/${bookId}?type=pdf#toolbar=1&navpanes=1&scrollbar=1`}
          type="application/pdf"
          className="w-full h-full"
        />
        <p className="text-center p-4 bg-gray-100 rounded-lg">PDF preview is not available. You can download the PDF using the download button.</p>
      </object>
    </div>
);

export default PdfViewer;