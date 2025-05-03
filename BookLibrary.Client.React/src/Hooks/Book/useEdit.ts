import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book } from "../../Types/book";
import bookSchema from "../../validation/bookValidation";
import useFetch from "../useFetch";
import { toast } from "react-toastify";

const useEdit = () => {
    const [dataLoading, setDataLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate()
    const [initialValues, setInitialValues] = useState<Book>({
        title: '',
        author: '',
        isbn: '',
        publicationDate: '',
        description: '',
        numberOfPage: 0,
        genre: '',
        publisher: '',
        language: ''
    });



    const { error, fetchData, loading } = useFetch()

    useEffect(() => {
        const fetchInitial = async () => {
            setDataLoading(true);
            await fetchData<Book>("/Book/" + id, { method: 'get' })
                .then((fetchedData) => {
                    if (!fetchedData) return;
                    setInitialValues(fetchedData);
                    formik.setValues(fetchedData);
                })
                .catch(err => {
                    console.log(error)
                    console.error('There was an error fetching the book!', err);
                })
                .finally(() => {
                    setDataLoading(false);
                })
        }
        fetchInitial();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    const formik = useFormik({
        enableReinitialize: true,
        validationSchema: bookSchema,
        initialValues: initialValues,
        onSubmit: values => {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                const typedKey = key as keyof Book;
                if (typedKey !== 'image' && typedKey !== 'pdf' && values[typedKey] !== undefined && values[typedKey] !== null) {
                    formData.append(typedKey, values[typedKey].toString());
                }
            });

            if (values.image instanceof File) {
                formData.append('image', values.image);
            }

            if (values.pdf instanceof File) {
                formData.append('pdf', values.pdf);
            }
            
            fetchData<Book>("Book/update", { method: 'put', data: values }, "fileApi")
                .then(() => {
                    navigate("/books")
                })
                .catch(error => {
                    console.error('There was an error updating the book!', error);
                });
        },
    });

    const { handleChange, handleSubmit, values, errors } = formik;

    useEffect(() => {
        if (error && loading === false) {
            toast.error(error);
        }
    }, [error, loading]);



    return { handleChange, handleSubmit, values, errors, dataLoading, loading };
}
export default useEdit