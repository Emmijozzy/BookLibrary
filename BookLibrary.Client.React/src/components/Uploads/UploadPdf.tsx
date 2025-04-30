import React from 'react';
import { useUpload } from '../../Hooks/useUpload';
import { MdCancel } from 'react-icons/md';

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string
}

export const UploadPdf = ({handleChange, error}: Props) => {

  const {handleFileChange, pdfPreview, pdfUploadProgress, fileName, handleCanclePdf} = useUpload({handleChange});

  return (
    <div className="flex flex-col gap-4 bg-gray-50 p-4 min-h-30 rounded-lg border border-gray-200">
      <div className='flex justify-between'>
        <label htmlFor="pdf" className="text-gray-700 block text-sm font-semibold mb-2">PDF Upload </label>
            <input
                id="pdf"
                name="pdf"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
        />
        {pdfPreview && <button type='button' onClick={handleCanclePdf}><MdCancel  /></button>}
      </div>
      <label htmlFor="pdf" className="my-auto m cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
          {pdfPreview ? (
                  <iframe src={pdfPreview} title="PDF Preview" className="w-full h-64 hidden lg:block rounded-lg" />
              ) : (
                  <span className="text-gray-500">Click to upload PDF</span>
          )}

          {pdfUploadProgress > 0 && pdfUploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${pdfUploadProgress}%` }}></div>
              </div>
          )}
      </label>
      {fileName &&<span className="text-gray-700 block text-sm font-semibold mb-2"> File Uploeded: {  fileName}</span>}
      {error && <span className="text-red-600 text-sm block mt-2">{error}</span>}
    </div>
  )
}