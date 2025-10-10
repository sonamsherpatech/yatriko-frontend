import { ICategoryType } from "@/app/dashboard/organization/category/organization-category-type";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createCategory,
  editCategory,
  getCategories,
  resetStatus,
} from "@/lib/store/organization/category/category-slice";
import { showToast } from "@/lib/toastify/toastify";
import { Status } from "@/lib/types";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import categorySchema from "@/app/dashboard/organization/category/organization-category-validation";
import { IOrganizationCategoryType } from "@/lib/store/organization/category/category-slice-types";

interface ICloseModal {
  modalClose: () => void;
  categoryToEdit?: IOrganizationCategoryType | null;
}

const errorStyle = {
  color: "red",
  fontSize: "11px",
};

const CategoryModal: React.FC<ICloseModal> = ({
  modalClose,
  categoryToEdit,
}) => {
  const [data, setData] = useState<ICategoryType>({
    categoryDescription: categoryToEdit?.categoryDescription || "",
    categoryName: categoryToEdit?.categoryName || "",
  });
  const [errors, setErrors] = useState<Record<string, any>>({});

  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector(
    (store) => store.organizationCategory
  );
  const isEditMode = !!categoryToEdit;

  useEffect(() => {
    if (status === Status.SUCCESS) {
      showToast({
        text: isEditMode
          ? "Category Updated Sucessfully"
          : "Category Created Sucessfully",
        style: {
          background: "#008000",
          color: "white",
        },
      });
      dispatch(getCategories());
      dispatch(resetStatus());
      modalClose();
    } else if (status === Status.ERROR) {
      showToast({
        text: error || `Error to ${isEditMode ? "update" : "create"} category`,
        style: {
          background: "#800000",
          text: "white",
        },
      });
    }
  }, [error, status, isEditMode]);

  function handleCategoryDataChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function handleCategoryDataSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = categorySchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors({});
      if (isEditMode) {
        dispatch(editCategory(categoryToEdit.id, data));
      } else {
        dispatch(createCategory(data));
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80  flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          {isEditMode ? "Edit Category" : "Create Category"}
        </h2>
        <button
          onClick={modalClose}
          className="absolute top-8 right-7 cursor-pointer hover:text-red-500"
        >
          {<X size={30} />}
        </button>

        <form onSubmit={handleCategoryDataSubmission}>
          <div className="mb-6">
            <label
              htmlFor="categoryName"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              value={data.categoryName}
              onChange={handleCategoryDataChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category name"
            />
            {errors.categoryName && (
              <p style={errorStyle}>{errors.categoryName._errors[0]}</p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="categoryDescription"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Category Description
            </label>
            <textarea
              id="categoryDescription"
              rows={5}
              name="categoryDescription"
              value={data.categoryDescription}
              onChange={handleCategoryDataChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category description"
            />
            {errors.categoryDescription && (
              <p style={errorStyle}>{errors.categoryDescription._errors[0]}</p>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={modalClose}
              type="button"
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm cursor-pointer"
            >
              {isEditMode ? "Edit Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
