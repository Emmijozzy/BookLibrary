import { useEffect, useState } from "react";
import { Book } from "../../../Types/book";
import UseFetch from "../../UseFetch";

export const useBookData = (id: string | undefined) => {
  const [dataLoading, setDataLoading] = useState(false);
  const [book, setBook] = useState<Book>({
    id: '',
    title: '',
    author: '',
    isbn: '',
    publicationDate: '',
    description: '',
    numberOfPage: 0,
    genre: '',
    publisher: '',
    language: '',
    imageUrl: '',
    pdfUrl: ''
  });

  const { error, fetchData } = UseFetch();

  useEffect(() => {
    const getBook = async () => {
      if (!id) return;
    
      setDataLoading(true);
      try {
        const fetchedData = await fetchData<Book>(`Book/${id}`, { method: 'get' });
        if (fetchedData) {
          setBook(fetchedData);
        }
      } catch (err) {
        console.log(error);
        console.error('There was an error fetching the book!', err);
      } finally {
        setDataLoading(false);
      }
    };
  
    getBook();
  }, [id, error, fetchData]);

  return { book, dataLoading };
};
