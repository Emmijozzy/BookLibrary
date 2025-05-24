import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessDenied2 from "../../components/AccessDenied2";
import { CategorySelect } from "../../components/CategorySelect";
import { DescriptionTextarea } from "../../components/DescriptionTextarea";
import { FormField, FormInputs } from "../../components/Edit/FormInputs";
import { PageHeader } from "../../components/Edit/PageHeader";
import { SubmitButton } from "../../components/Edit/SubmitButton";
import ErrorMsg from "../../components/ErrorMsg";
import { ImagePreview } from "../../components/ImagePreview";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PdfPreview } from "../../components/PdfPreview";
import { UploadImage } from "../../components/Uploads/UploadImage";
import { UploadPdf } from "../../components/Uploads/UploadPdf";
import UseEdit from "../../Hooks/Book/useEdit";
import { useCategories } from "../../Hooks/Category/useFetchCategory";
import { useApp } from "../../Hooks/useApp";

const Edit = () => {
    const { handleChange, handleSubmit, values, errors, dataLoading, loading, error } = UseEdit();
    const categories = useCategories();
    const { appUserId, currentRole } = useApp();
    const isAdmin = currentRole === 'Admin';
  
    // Define form fields configuration
    const inputFields: FormField[] = [
        { id: "title", name: "title", type: "text", label: "Title", placeholder: "Title" },
        { id: "author", name: "author", type: "text", label: "Author", placeholder: "Author" },
        { id: "isbn", name: "isbn", type: "text", label: "ISBN", placeholder: "ISBN" },
        { id: "publicationDate", name: "publicationDate", type: "date", label: "Publication Date" },
        { id: "numberOfPage", name: "numberOfPage", type: "number", label: "Number of Pages", placeholder: "Number of Pages" },
        { id: "genre", name: "genre", type: "text", label: "Genre", placeholder: "Genre" },
        { id: "publisher", name: "publisher", type: "text", label: "Publisher", placeholder: "Publisher" },
        { id: "language", name: "language", type: "text", label: "Language", placeholder: "Language" },
    ];

    if (dataLoading) {
        return <LoadingSpinner />;
    }

    if (!isAdmin &&  values.createdBy !== appUserId) {
        return (
            <AccessDenied2 message="You are not authorized to edit this book. Only the creator can make changes." />
        );
    }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {error && (
              <ErrorMsg error={error} />
          )}

          <PageHeader />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <FormInputs 
                  inputFields={inputFields} 
                  handleChange={handleChange} 
                  values={values} 
                  errors={errors} 
                />

                <div className="col-span-2 md:col-span-1">
                    <CategorySelect 
                    categories={categories} 
                    selectedCategoryId={values.categoryId || ''} 
                    handleChange={handleChange} 
                    />
                </div>
                
                {/* Privacy Setting */}
                <div className="col-span-2 md:col-span-1 mb-2">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center h-5">
                      <input
                        id="isPrivate"
                        name="isPrivate"
                        type="checkbox"
                        checked={values.isPrivate || false}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="isPrivate" className="font-medium text-gray-700 cursor-pointer">
                        Private Book
                      </label>
                      <p className="text-gray-500 text-sm">
                        When enabled, this book will only be visible to you
                      </p>
                    </div>
                  </div>
                  {errors.isPrivate && (
                    <p className="mt-1 text-sm text-red-600">{errors.isPrivate}</p>
                  )}
                </div>
                
                {/* Image Upload */}
                <UploadImage className='col-span-2 md:col-span-1' handleChange={handleChange} error={errors.image} />

                {/* PDF Upload */}
                <UploadPdf className='col-span-2 md:col-span-1' handleChange={handleChange} error={errors.pdf} />
                
                <DescriptionTextarea 
                  description={values.description} 
                  error={errors.description || ""} 
                  handleChange={handleChange} 
                />

                <SubmitButton isLoading={loading} />
              </form>
            </div>           
          </div>
        </div>
        
        <div className="space-y-6 py-6">
          {values.id && (
            <>
              <ImagePreview bookId={values.id} />
              <PdfPreview bookId={values.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Edit;
