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

  return (
    <div key={field.id} className={bodyClassName}>
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}</label>
      <input
        id={field.id}
        name={field.name}
        type={field.type}
        onChange={handleChange}
        {...(!isFileInput && {
          value: values && field.name in values
            ? field.type === 'date' && values[field.name as keyof (Book | Category)]
              ? new Date(values[field.name as keyof (Book | Category)] as string).toISOString().split('T')[0]
              : values[field.name as keyof (Book | Category)]
            : ''
        })}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
        placeholder={field.placeholder}
      />
      <span className="text-red-600 text-sm">{errors && field.name in errors ? errors[field.name as keyof (Book | Category)] : ''}</span>
    </div>
  );
}