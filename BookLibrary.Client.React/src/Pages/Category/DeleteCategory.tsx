import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UseFetch from "../../Hooks/UseFetch";
import { Category } from "../../Types/category";
import ErrorMsg from "../../components/ErrorMsg";

const DeleteCategory = () => {
  const [dataLoading, setDataLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
  });

  const  {error, fetchData, } = UseFetch()

  useEffect(() => {
    const getCategory = async () => {
      setDataLoading(true);
      await fetchData<Category>("Category/"+id , { method: 'get'})
      .then((initialData) => {
        if (initialData) setCategory(initialData)
      })
      .catch(err => {
          console.log(error)
          console.error('There was an error fetching the book!', err);
      })
      .finally(() => {
          setDataLoading(false);
      })
    }
    getCategory();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    const deleteCategory = async () => {
      await fetchData("Category/delete/"+id , { method: 'delete'})
          .then(() => {
              navigate('/categories');
          })
          .catch(error => {
              console.error('There was an error deleting the book!', error);
          });
    }

    deleteCategory();

  };
  if (dataLoading) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-2xl text-gray-600">Loading...</div>
        </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex justify-between items-center mb-4">
          <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
              ← Back
          </button>
      </div>

      {error && (
        <ErrorMsg error={error} />
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-600 mb-4">{category.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                  <p className="text-gray-500">Created At</p>
                  <p>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                  <p className="text-gray-500">Updated At</p>
                  <p>{category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
          </div>
      </div>

      <div className="col-span-2">
        <button onClick={handleDelete} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Confirm Delete
        </button>
      </div>
    </div>  )
}

export default DeleteCategory