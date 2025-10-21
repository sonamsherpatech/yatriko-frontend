import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IOrganizationTourInitialState,
  IOrganizationTourType as IOrganizationTourTypes,
} from "./tour-slice-types";
import { Status } from "@/lib/types";
import API from "@/lib/http";
import { IOrganizationTourType } from "@/app/dashboard/organization/tour/create/organization-tour-types";
import { AppDispatch } from "../../store";

const initialState: IOrganizationTourInitialState = {
  tour: [],
  currentTour: null,
  status: Status.IDLE,
  error: null,
};

const organizationTourSlice = createSlice({
  name: "tourSlice",
  initialState,
  reducers: {
    setTour(
      state: IOrganizationTourInitialState,
      action: PayloadAction<IOrganizationTourTypes[]>
    ) {
      state.tour = action.payload;
    },
    setCurrentTour(
      state: IOrganizationTourInitialState,
      action: PayloadAction<IOrganizationTourTypes | null>
    ) {
      state.currentTour = action.payload;
    },
    setStatus(
      state: IOrganizationTourInitialState,
      action: PayloadAction<Status>
    ) {
      state.status = action.payload;
    },
    setTourEdit(
      state: IOrganizationTourInitialState,
      action: PayloadAction<{
        tourId: string;
        data: Partial<IOrganizationTourTypes>;
      }>
    ) {
      const tourId = action.payload.tourId;
      const editedData = action.payload.data;

      const index = state.tour.findIndex((tour) => tour.tourId === tourId);
      if (index !== -1) {
        state.tour[index] = { ...state.tour[index], ...editedData };
      }

      if (state.currentTour?.tourId === tourId) {
        state.currentTour = { ...state.currentTour, ...editedData };
      }
    },
    setTourDelete(
      state: IOrganizationTourInitialState,
      action: PayloadAction<string>
    ) {
      const tourId = action.payload;
      const index = state.tour.findIndex((tour) => tour.tourId === tourId);
      if (index !== -1) {
        state.tour.splice(index, 1);
      }
    },
    setError(
      state: IOrganizationTourInitialState,
      action: PayloadAction<string | null>
    ) {
      state.error = action.payload;
    },
    resetStatus(state: IOrganizationTourInitialState) {
      state.status = Status.IDLE;
      state.error = null;
    },
  },
});

export const {
  setTour,
  setCurrentTour,
  setStatus,
  resetStatus,
  setError,
  setTourDelete,
  setTourEdit,
} = organizationTourSlice.actions;
export default organizationTourSlice.reducer;

//Tour Thnuk

//1. API call to create Tour
export function createTour(data: IOrganizationTourType) {
  return async function createTourThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const formData = new FormData();
      formData.append("tourTitle", data.tourTitle);
      formData.append("tourDescription", data.tourDescription);
      formData.append("tourNumberOfPeople", data.tourNumberOfPeople);
      formData.append("tourPrice", data.tourPrice);
      formData.append("tourDuration", data.tourDuration);
      formData.append("tourStartDate", data.tourStartDate);
      formData.append("tourEndDate", data.tourEndDate);

      if (data.categoryIds && data.categoryIds.length > 0) {
        formData.append("categoryIds", JSON.stringify(data.categoryIds));
      }
      if (data.tourPhoto && data.tourPhoto instanceof File) {
        formData.append("tourPhoto", data.tourPhoto);
      }

      const response = await API.post(`/organization/tour`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        // dispatch(getTours());
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to create tour"));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to create tour")
      );
    }
  };
}

//2. API call to get all Tours
export function getTours() {
  return async function getToursThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.get(`/organization/tour`);
      if (response.status === 200) {
        response.data.data.length > 0 && dispatch(setTour(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to fetch tours"));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch tours")
      );
    }
  };
}

//3. API call to  delete Tour
export function deleteTour(id?: string) {
  return async function deleteTourThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.delete(`/organization/tour/${id}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        dispatch(getTours());
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to delete tour"));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to delete tour")
      );
    }
  };
}

//4. API call to edit Tour
export function editTour(payload: { tourId: string; data: FormData }) {
  return async function editTourThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.patch(
        `/organization/tour/${payload.tourId}`,
        payload.data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        dispatch(
          setTourEdit({ tourId: payload.tourId, data: response.data.data })
        );
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

// 5. API call to get singleTour by Id
export function getTourById(id: string) {
  return async function getTourByIdThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.get(`/organization/tour/${id}`);
      if (response.status === 200) {
        dispatch(setCurrentTour(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to fetch tour"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch tour")
      );
    }
  };
}
