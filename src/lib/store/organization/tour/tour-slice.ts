import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IOrganizationTourInitialState,
  IOrganizationTourType as IOrganizationTourTypes
} from "./tour-slice-types";
import { Status } from "@/lib/types";
import { AppDispacth } from "../../store";
import API from "@/lib/http";
import { IOrganizationTourType } from "@/app/dashboard/organization/tour/create/organization-tour-types";

const initialState: IOrganizationTourInitialState = {
  tour: [],
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
    setStatus(
      state: IOrganizationTourInitialState,
      action: PayloadAction<Status>
    ) {
      state.status = action.payload;
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

export const { setTour, setStatus, resetStatus, setError } =
  organizationTourSlice.actions;
export default organizationTourSlice.reducer;

//Tour Thnuk

//1. Create Tour
export function createTour(data: IOrganizationTourType) {
  return async function createTourThunk(dispatch: AppDispacth) {
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

//2. Get Tour
export function getTours() {
  return async function getToursThunk(dispatch: AppDispacth) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.get(`/organization/tour`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        dispatch(setTour(response.data.data));
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
