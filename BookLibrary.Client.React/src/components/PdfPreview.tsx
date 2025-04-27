import { FaDownload, FaFilePdf } from "react-icons/fa";
import { usePdfViewer } from "../Hooks/Book/usePdfViewer";
import PdfViewer from "./PdfViewer/PdfViewer";


export const PdfPreview = ({ bookId }: { bookId?: string }) => {
    const { 
        pdfPreviewOpen, 
        isFullScreen, 
        togglePdfPreview, 
        toggleFullScreen, 
        handlePdfDownload 
    } = usePdfViewer(bookId);

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
        <FaFilePdf className="mr-2 text-red-500" />
        Current PDF Document
      </h3>
      
      <div className="flex flex-col space-y-3">
        <button 
          onClick={handlePdfDownload}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
        >
          <FaDownload className="mr-2" />
          Download PDF
        </button>
        
        <button 
          onClick={togglePdfPreview}
          className="w-full py-3 px-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center"
        >
          {pdfPreviewOpen ? 'Hide Preview' : 'Show Preview'}
        </button>
        
        {bookId && pdfPreviewOpen && (
          <PdfViewer 
            bookId={bookId}
            isFullScreen={isFullScreen}
            onToggleFullScreen={toggleFullScreen}
            onClose={togglePdfPreview}
          />
        )}
      </div>
    </div>
  );
};