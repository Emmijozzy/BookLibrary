import { Book } from "../Types/book";
import { FormikErrors } from "formik";
import { Category } from "../Types/category";

type Props = {
  field: {
    id: string;
    label: string;
    name: string;
    type: string;
    placeholder?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values?: Book | Category;
  errors: FormikErrors<Book | Category>;
  className?: string;
  bodyClassName?: string;
}

export const Input = ({ field, handleChange, values, errors, className = "", bodyClassName = "" }: Props) => {
  const isFileInput = field.type === 'file';
  const fieldValue = values && field.name in values
    ? field.type === 'date' && values[field.name as keyof (Book | Category)]
      ? new Date(values[field.name as keyof (Book | Category)] as string).toISOString().split('T')[0]
      : values[field.name as keyof (Book | Category)]
    : '';
  const errorMessage = errors && field.name in errors ? errors[field.name as keyof (Book | Category)] : '';

  return (
    <div key={field.id} className={`${bodyClassName} col-span-2 md:col-span-1 space-y-1`}>
      <label 
        htmlFor={field.id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {field.label}
      </label>
      <input
        id={field.id}
        name={field.name}
        type={field.type}
        onChange={handleChange}
        {...(!isFileInput && { value: fieldValue })}
        className={`
        
          block 
          w-full 
          px-3 
          py-2 
          rounded-md 
          border-gray-300 
          bg-white
          shadow-sm 
          transition-all
          duration-200
          focus:border-indigo-500 
          focus:ring-2
          focus:ring-indigo-500 
          focus:ring-opacity-50
          ${className}
          ${errorMessage ? 'border-red-300' : ''}
        `}
        placeholder={field.placeholder}
      />
      {errorMessage && (
        <span className="text-red-600 text-sm block mt-1">
          {errorMessage}
        </span>
      )}
    </div>
  );
}