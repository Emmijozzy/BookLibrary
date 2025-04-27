import { useState, useEffect } from "react";
import { Category } from "../../Types/category";
import UseFetch from "../UseFetch";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { error, fetchData } = UseFetch();
  
  useEffect(() => {
    const getCategories = async () => {
      try {
        const fetchedData = await fetchData("Category/all?includeProperties=Books", { method: 'get' });
        if (fetchedData) {
          setCategories(fetchedData as unknown as Category[]);
        }
      } catch (err) {
        console.log(error);
        console.error('There was an error fetching the categories!', err);
      }
    };
    
    getCategories();
  }, [error, fetchData]);
  
  return categories;
};