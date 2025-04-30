import { useCallback, useEffect, useState } from "react";

export const usePdfViewer = () => {
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

    return { pdfPreviewOpen, isFullScreen, togglePdfPreview, toggleFullScreen };
};