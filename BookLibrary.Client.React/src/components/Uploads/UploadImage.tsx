import { MdCancel } from "react-icons/md";
import { useUpload } from "../../Hooks/useUpload";

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string
  className?: string;
}

export const UploadImage = ({ handleChange, error, className="" }: Props) => {

  const {handleFileChange, imagePreview, imageUploadProgress, handleCancleImage } = useUpload({handleChange});

  return (
    <div className={`flex flex-col gap-4 bg-gray-50 p-4 min-h-30 rounded-lg border border-gray-200 ${className}`}>
      <div className="flex justify-between">
      <label htmlFor="image" className="text-gray-700 block text-sm font-semibold mb-2">Image Upload</label>
        {imagePreview && <button type='button' onClick={handleCancleImage}><MdCancel  /></button>}
      </div>
      <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
      />
      <label htmlFor="image" className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
          {imagePreview ? (
                  <img src={imagePreview} alt="Image Preview" className="mx-auto max-h-64 object-contain rounded-lg" />
              ) : (
                  <span className="text-gray-500">Click to upload image</span>
          )}

          {imageUploadProgress > 0 && imageUploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${imageUploadProgress}%` }}></div>
              </div>
          )}
      </label>
      {error && <span className="text-red-600 text-sm block mt-2">{error}</span>}
    </div>
  )
}