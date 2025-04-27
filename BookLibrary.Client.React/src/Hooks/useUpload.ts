import { useState } from "react";

type Props = {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const useUpload = ({handleChange}: Props) => {
      const [imagePreview, setImagePreview] = useState<string | null>(null);
      const [fileName, setFileName] = useState<string | null>(null);
      const [pdfPreview, setPdfPreview] = useState<string | null>(null);
      const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);
      const [pdfUploadProgress, setPdfUploadProgress] = useState<number>(0);


      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, files } = e.target;
          if (files && files.length > 0) {
              const file = files[0];
              
              handleChange({
                  target: {
                      name,
                      value: file
                  }
              } as unknown as React.ChangeEvent<HTMLInputElement>);
  
              const reader = new FileReader();
  
              console.log(file.name);
              
              reader.onprogress = (event) => {
                  if (event.lengthComputable) {
                      const progress = Math.round((event.loaded / event.total) * 100);
                      if (name === "image") {
                          setImageUploadProgress(progress);
                      } else if (name === "pdf") {
                          setPdfUploadProgress(progress);
                      }
                  }
              };
  
              reader.onloadend = () => {
                  if (name === "image") {
                      setImagePreview(reader.result as string);
                      setImageUploadProgress(100);
                  } else if (name === "pdf") {
                      setPdfPreview(reader.result as string);
                      setPdfUploadProgress(100);
                      setFileName(file.name);
                  }
              };
  
              reader.readAsDataURL(file);
          }
      };

      const handleCanclePdf = () => {
          setPdfPreview(null);
          setPdfUploadProgress(0);
          setFileName(null);
      }

      const handleCancleImage = () => {
          setImagePreview(null);
          setImageUploadProgress(0);
      }
  
  return {
    handleFileChange,
    imagePreview,
    fileName,
    pdfPreview,
    imageUploadProgress,
    pdfUploadProgress,
    handleCanclePdf,
    handleCancleImage
  }
}