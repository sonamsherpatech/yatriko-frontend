import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IOrganizationCategoryInitialState,
  IOrganizationCategoryType,
} from "./category-slice-types";
import { Status } from "@/lib/types";
import { AppDispacth } from "../../store";
import API from "@/lib/http";
import { ICategoryType } from "@/app/dashboard/organization/category/organization-category-type";

const initialState: IOrganizationCategoryInitialState = {
  category: [],
  status: Status.LOADING,
  error: null,
};

const organizationCategorySlice = createSlice({
  name: "organization-category-slice",
  initialState,
  reducers: {
    setCategory(
      state: IOrganizationCategoryInitialState,
      action: PayloadAction<IOrganizationCategoryType[]>
    ) {
      state.category = action.payload;
    },
    setStatus(
      state: IOrganizationCategoryInitialState,
      action: PayloadAction<Status>
    ) {
      state.status = action.payload;
    },
    setCategoryDelete(
      state: IOrganizationCategoryInitialState,
      action: PayloadAction<string>
    ) {
      const categoryId = action.payload;
      const index = state.category.findIndex(
        (category) => category.id === categoryId
      );
      if (index !== -1) {
        state.category.splice(index, 1);
      }
    },
    setCategoryEdit(
      state: IOrganizationCategoryInitialState,
      action: PayloadAction<{
        id: string;
        data: Partial<IOrganizationCategoryType>;
      }>
    ) {
      const categoryId = action.payload.id;
      const data = action.payload.data;
      const index = state.category.findIndex((cat) => cat.id === categoryId);
      if (index !== -1) {
        state.category[index] = { ...state.category[index], ...data };
      }
    },
    setError(
      state: IOrganizationCategoryInitialState,
      action: PayloadAction<string | null>
    ) {
      state.error = action.payload;
    },
    resetStatus(state: IOrganizationCategoryInitialState) {
      state.status = Status.LOADING;
      state.error = null;
    },
  },
});

export const {
  resetStatus,
  setCategory,
  setCategoryDelete,
  setCategoryEdit,
  setError,
  setStatus,
} = organizationCategorySlice.actions;
export default organizationCategorySlice.reducer;

//Category Thunk
// 1. API call to insert category
export function createCategory(data: ICategoryType) {
  return async function createCategoryThunk(dispatch: AppDispacth) {
    dispatch(resetStatus());
    try {
      //API Call
      const response = await API.post("/organization/category/", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        response.data.data.length > 0 &&
          dispatch(setCategory(response.data.data));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to create category"));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to create category")
      );
    }
  };
}

// 2. API call to get all categories
export function getCategories() {
  return async function getCategoriesThunk(dispatch: AppDispacth) {
    dispatch(resetStatus());
    try {
      const response = await API.get("/organization/category/");
      if (response.status === 200) {
        response.data.data.length > 0 &&
          dispatch(setCategory(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        setError("Failed to fetch categories");
      }
    } catch (error: any) {
      console.log(error);
      dispatch(
        setError(error.response?.data?.message) || "Failed to fetch categories"
      );
      dispatch(setStatus(Status.ERROR));
    }
  };
}

//3. API call to delete category
export function deleteCategory(id: string) {
  return async function deleteCategoryThunk(dispatch: AppDispacth) {
    dispatch(resetStatus());
    try {
      const response = await API.delete(`/organization/category/${id}`);
      if (response.status === 200) {
        dispatch(setCategoryDelete(id));
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to delete category"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to delte category")
      );
    }
  };
}

//4. API call to edit category
export function editCategory(id: string, data: any) {
  return async function editCategoryThunk(dispatch: AppDispacth) {
    dispatch(resetStatus());
    try {
      const response = await API.patch(`/organization/category/${id}`, data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setCategoryEdit({ id, data: response.data.data }));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to edit category"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to edit category")
      );
    }
  };
}

//5. API call to select/get individaul category
export function getCategory(id: string) {
  return async function getCategoryThunk(dispatch: AppDispacth) {
    dispatch(resetStatus());
    try {
      const response = await API.get(`/organization/category/${id}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        response.data.data.length > 0 &&
          dispatch(setCategory(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to fetch category"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch category")
      );
    }
  };
}
