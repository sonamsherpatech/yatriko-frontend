"use client";
import CategoryModal from "@/lib/components/dashboard/organization/CategoryModal";
import { Edit3, MousePointerSquareDashed, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  deleteCategory,
  getCategories,
  resetStatus,
} from "@/lib/store/organization/category/category-slice";
import { Status } from "@/lib/types";
import { showToast } from "@/lib/toastify/toastify";
import { IOrganizationCategoryType } from "@/lib/store/organization/category/category-slice-types";
import { useRouter } from "next/navigation";

export default function OrganizationTourCategory() {
  const {
    category: categories,
    status,
    error,
  } = useAppSelector((store) => store.organizationCategory);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [editingCategory, setEditingCategory] =
    useState<IOrganizationCategoryType | null>(null);

  const dispatch = useAppDispatch();
  const isDeleting = useRef(false);
  const router = useRouter();
  const filteredData =
    categories?.filter(
      (category) =>
        category.categoryName
          .toLowerCase()
          .includes(searchCategory.toLowerCase()) ||
        category.categoryDescription
          .toLowerCase()
          .includes(searchCategory.toLowerCase())
    ) || [];

  const modalOpen = () => {
    isDeleting.current = false;
    dispatch(resetStatus());
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const modalClose = () => {
    dispatch(resetStatus());
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  function handleSelectCategory(id: string) {
    dispatch(resetStatus());
    router.push(`/dashboard/organization/category/${id}`);
  }

  function handleCategoryEdit(category: IOrganizationCategoryType) {
    isDeleting.current = false;
    dispatch(resetStatus());
    setEditingCategory(category);
    setIsModalOpen(true);
  }

  function handleDeleteCategory(id: string) {
    if (id) {
      isDeleting.current = true;
      dispatch(deleteCategory(id));
    }
  }

  useEffect(() => {
    dispatch(getCategories());
    dispatch(resetStatus());
  }, []);

  useEffect(() => {
    if (isDeleting.current) {
      if (status === Status.SUCCESS) {
        showToast({
          text: "Category Deleted Sucessfully",
          style: {
            background: "#008000",
            color: "white",
          },
        });
        dispatch(resetStatus());
        isDeleting.current = false;
      } else if (status === Status.ERROR) {
        showToast({
          text: error || "Failed to delete category",
          style: {
            background: "#800000",
            color: "white",
          },
        });
        dispatch(resetStatus());
        isDeleting.current = false;
      }
    }
  }, [status, error]);

  return (
    <div className="p-8">
      {isModalOpen && (
        <CategoryModal
          modalClose={modalClose}
          categoryToEdit={editingCategory}
        />
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Create Category
          </h1>
          <button
            onClick={modalOpen}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            Add Category <span className="text-lg font-bold">+</span>
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            name="SearchCategory"
            onChange={(e) => setSearchCategory(e.target.value)}
            value={searchCategory}
            placeholder="Search Category"
            className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className=" text-gray-700 text-left">
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Description</th>
                <th className="px-4 py-3 border-b">Created At</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((cat: IOrganizationCategoryType) => (
                  <tr key={cat.id} className=" transition-colors border-b">
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {cat.categoryName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cat.categoryDescription.length > 30
                        ? cat.categoryDescription.substring(0, 30) + "..."
                        : cat.categoryDescription}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(
                        cat?.createdAt?.toString()
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3 text-gray-600">
                      <button
                        onClick={() => handleCategoryEdit(cat)}
                        title="Edit"
                        className="hover:text-blue-600 cursor-pointer transition"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat?.id)}
                        title="Delete"
                        className="hover:text-red-600 cursor-pointer transition"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleSelectCategory(cat?.id)}
                        title="Select"
                        className="hover:text-green-600 cursor-pointer transition"
                      >
                        <MousePointerSquareDashed size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No Categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
