import { FormikErrors } from "formik";
import { Book } from "../../Types/book";
import { Input } from "../Input";

export interface FormField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
}

export const FormInputs = ({ 
  inputFields, 
  handleChange, 
  values, 
  errors 
}: { 
  inputFields: FormField[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  values: Book;
  errors: FormikErrors<Book>;
}) => (
  <>
    {inputFields.map((field) => (
      <Input 
        key={field.id} 
        field={field} 
        handleChange={handleChange} 
        values={{...values, numberOfPage: values.numberOfPage || 0}} 
        errors={{...errors, numberOfPage: errors.numberOfPage?.toString() || ''}}
      />
    ))}
  </>
);
