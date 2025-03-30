import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "../../Types/book";
import bookSchema from "../../validation/bookValidation";
import UseFetch from "../UseFetch";

const UseCreate = () => {
    const navigate = useNavigate()
    const [initialValues] = useState<Book>({
        title: '',
        author: '',
        isbn: '',
        publicationDate: '',
        description: '',
        numberOfPage: 0,
        genre: '',
        publisher: '',
        language: '',
        categoryId: ''
    });

    const { fetchData } = UseFetch()

    const formik = useFormik({
        enableReinitialize: true,
        validationSchema: bookSchema,
        initialValues: initialValues,
        onSubmit: values => {
            fetchData<Book>("/Book/add", { method: 'post', data: values })
                .then(() => {
                    navigate("/books")
                })
                .catch(error => {
                    console.error('There was an error updating the book!', error);
                });
        },
    });

    const { handleChange, handleSubmit, values, errors } = formik;



    return { handleChange, handleSubmit, values, errors };
}
export default UseCreate