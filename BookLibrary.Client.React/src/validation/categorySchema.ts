import * as Yup from "yup";

export const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(3, 'Category name must be at least 3 characters')
    .max(20, 'Category cannot be longer than 20 characters'),
  description: Yup.string()
    .required("Description is required")
    .min(3, 'Description must be at least 3 characters')
    .max(300, 'Description cannot be longer than 250 characters'),
})