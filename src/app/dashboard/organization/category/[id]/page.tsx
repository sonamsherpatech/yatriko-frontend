"use client";
import CategoryModal from "@/lib/components/dashboard/organization/CategoryModal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  getCategory,
  resetStatus,
} from "@/lib/store/organization/category/category-slice";
import { Status } from "@/lib/types";
import { ArrowLeft, Calendar, Edit3 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const categoryId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { status, error, category } = useAppSelector(
    (store) => store.organizationCategory
  );

  useEffect(() => {
    if (categoryId) {
      dispatch(resetStatus());
      dispatch(getCategory(categoryId));
    }
  }, [categoryId, dispatch]);

  const modalOpen = () => {
    dispatch(resetStatus());
    setIsModalOpen(true);
  };
  const modalClose = () => {
    setIsModalOpen(false);
  };

  const selectedCategory =
    category.find((cat) => cat.id === categoryId) || category[0];

  if (status === Status.LOADING && !isModalOpen && category.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !selectedCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-red-600 mb-4">Category Not Found</div>
        <button
          onClick={() => router.push("/dashboard/organization/category")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {isModalOpen && (
        <CategoryModal
          modalClose={modalClose}
          categoryToEdit={selectedCategory}
        />
      )}

      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/organization/category")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 cursor-pointer"
        >
          <ArrowLeft size={20} /> Back to Categories
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Category Details</h1>
          <button
            onClick={modalOpen}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            <Edit3 size={18} />
            Edit Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Category Name
          </label>
          <h2 className="text-2xl font-semibold textgray800 mt-2">
            {selectedCategory?.categoryName}
          </h2>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Category Description
          </label>
          <h2 className="text-2xl font-semibold textgray800 mt-2">
            {selectedCategory?.categoryDescription}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} />
          <span className="  text-sm">
            Created on{" "}
            {new Date(selectedCategory?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
