import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteCategoryAPI,
  listCategoriesAPI,
} from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const CategoriesList = () => {
  //fetching
  const { data, isError, isLoading, isFetched, error, refetch } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });
  //deleting
  //navigate to
  const navigate = useNavigate();
  //mutauion
  const {
    mutateAsync,
    isPending,
    error: categoryErr,
    isSuccess,
  } = useMutation({
    mutationFn: deleteCategoryAPI,
    mutationKey: ["delete-category"],
  });
  //delete handler
  const handleDelete = (id) => {
    mutateAsync(id)
      .then((data) => {
        refetch();
      })
      .catch((e) => console.log(e));
  };
  return (
    <div className="max-w-md mx-auto my-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
      {/*Display message */}
      {isLoading && <AlertMessage type="loading" message="Loading" />}
      {isError && (
        <AlertMessage type="error" message={error.response.data.message} />
      )}
      <ul className="space-y-4">
        {data?.map((category) => (
          <li
            key={category?._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
          >
            <div>
              <span className="text-gray-800">{category?.name}</span>
              <span
                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  category.type === "income"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {category?.type?.charAt(0).toUpperCase() +
                  category?.type?.slice(1)}
              </span>
            </div>
            <div className="flex space-x-3">
              <Link to={`/update-category/${category._id}`}>
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
              </Link>
              <button
                onClick={() => handleDelete(category?._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
