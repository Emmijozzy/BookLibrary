import { CategorySelect } from "../../components/CategorySelect";
import { DescriptionTextarea } from "../../components/DescriptionTextarea";
import { FormField, FormInputs } from "../../components/Edit/FormInputs";
import { PageHeader } from "../../components/Edit/PageHeader";
import { SubmitButton } from "../../components/Edit/SubmitButton";
import { ImagePreview } from "../../components/ImagePreview";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PdfPreview } from "../../components/PdfPreview";
import { UploadImage } from "../../components/Uploads/UploadImage";
import { UploadPdf } from "../../components/Uploads/UpLoadPdf";
import UseEdit from "../../Hooks/Book/useEdit";
import { useCategories } from "../../Hooks/Category/useCategories";

const Edit = () => {
    const { handleChange, handleSubmit, values, errors, dataLoading } = UseEdit();
    const categories = useCategories();
  
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
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

                <div className="col-span-2">
                    <CategorySelect 
                    categories={categories} 
                    selectedCategoryId={values.categoryId || ''} 
                    handleChange={handleChange} 
                    />
                </div>
                
                {/* Image Upload */}
                <UploadImage handleChange={handleChange} error={errors.image} />

                {/* PDF Upload */}
                <UploadPdf handleChange={handleChange} error={errors.pdf} />
                
                <DescriptionTextarea 
                  description={values.description} 
                  error={errors.description || ""} 
                  handleChange={handleChange} 
                />

                <SubmitButton />
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