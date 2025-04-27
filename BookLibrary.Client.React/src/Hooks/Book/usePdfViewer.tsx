import { useCallback, useEffect, useState } from "react";

// Constants
const API_BASE_URL = "https://localhost:7257/api";

export const usePdfViewer = (bookId?: string) => {
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePdfPreview = useCallback(() => {
    setPdfPreviewOpen(prev => !prev);
    if (isFullScreen) {
      setIsFullScreen(false);
      document.body.style.overflow = 'auto';
    }
  }, [isFullScreen]);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : 'auto';
      return !prev;
    });
  }, []);

  const handlePdfDownload = useCallback(() => {
    if (bookId) {
      window.open(`${API_BASE_URL}/File/proxy/${bookId}?type=pdf`, '_blank');
    }
  }, [bookId]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isFullScreen, toggleFullScreen]);

  return {
    pdfPreviewOpen,
    isFullScreen,
    togglePdfPreview,
    toggleFullScreen,
    handlePdfDownload
  };
};