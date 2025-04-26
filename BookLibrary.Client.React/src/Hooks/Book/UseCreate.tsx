import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "../../Types/book";
import bookSchema from "../../validation/bookValidation";
// import UseFetch from "../UseFetch";

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
        categoryId: '',
        //image: null,
        //pdf: null
    });

    // const { fetchData } = UseFetch()

    // const formik = useFormik({
    //     enableReinitialize: true,
    //     validationSchema: bookSchema,
    //     initialValues: initialValues,
    //     onSubmit: values => {
    //         fetchData<Book>("/Book/add", { method: 'post', data: values })
    //             .then(() => {
    //                 navigate("/books")
    //             })
    //             .catch(error => {
    //                 console.error('There was an error updating the book!', error);
    //             });
    //     },
    // });

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
            
            const token = localStorage.getItem('authToken');
            
            axios.post('https://localhost:7257/api/Book/add', formData, {
                headers: {
                    'Authorization': `Bearer ${token || ''}`
                }
            })
            .then(() => {
                navigate("/books");
            })
            .catch(error => {
                console.error('There was an error creating the book!', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                }
            });
        },
    });

    const { handleChange, handleSubmit, values, errors } = formik;



    return { handleChange, handleSubmit, values, errors };
}
export default UseCreate