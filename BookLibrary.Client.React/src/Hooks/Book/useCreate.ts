// import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "../../Types/book";
import bookSchema from "../../validation/bookValidation";
import useFetch from "../useFetch";
import { toast } from "react-toastify";

const useCreate = () => {
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
        categoryId: '',
        isPrivate: false,
    });

    const { fetchData, loading, error } = useFetch()

    const formik = useFormik({
        enableReinitialize: true,
        validationSchema: bookSchema,
        initialValues: initialValues,
        onSubmit: values => {
            const formData = new FormData();
            
            // Add all text fields from values to formData (without the 'bookDto.' prefix)
            Object.keys(values).forEach((key) => {
                const typedKey = key as keyof Book;
                // Skip file objects
                if (typedKey !== 'image' && typedKey !== 'pdf' && values[typedKey] !== undefined && values[typedKey] !== null) {
                    formData.append(typedKey, values[typedKey].toString());
                }
            });
            
            // Add files as separate top-level form fields
            if (values.image instanceof File) {
                formData.append('image', values.image);
            }
            
            if (values.pdf instanceof File) {
                formData.append('pdf', values.pdf);
            }
            
            fetchData<Book>("/Book/add", { method: 'post', data: formData }, "fileApi")
                .then(() => {
                    navigate("/books");
                })
                .catch(() => {
                    console.error('There was an error creating the book!', error);
                })
        },
    });

    useEffect ( () => {
        if (error && loading === false) {
            toast.error(error);
        }

        if (loading === false) {
            toast.clearWaitingQueue();
        }       
    }, [error, loading]);

    const { handleChange, handleSubmit, values, errors } = formik;



    return { handleChange, handleSubmit, values, errors, loading };
}
export default useCreate