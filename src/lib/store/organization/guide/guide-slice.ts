import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IOrganizationGuide,
  IOrganizationGuideInitialState,
} from "./guide-slice-types";
import { Status } from "@/lib/types";
import { AppDispatch } from "../../store";
import API from "@/lib/http";

const initialState: IOrganizationGuideInitialState = {
  guide: [],
  status: Status.IDLE,
  error: null,
};

const organizationGuideSlice = createSlice({
  name: "guideSlice",
  initialState,
  reducers: {
    setGuide(
      state: IOrganizationGuideInitialState,
      action: PayloadAction<IOrganizationGuide[]>
    ) {
      state.guide = action.payload;
    },
    setStatus(
      state: IOrganizationGuideInitialState,
      action: PayloadAction<Status>
    ) {
      state.status = action.payload;
    },
    setError(
      state: IOrganizationGuideInitialState,
      action: PayloadAction<string | null>
    ) {
      state.error = action.payload;
    },
    resetStatus(state: IOrganizationGuideInitialState) {
      state.status = Status.IDLE;
      state.error = null;
    },
  },
});

export const { setGuide, setStatus, setError, resetStatus } =
  organizationGuideSlice.actions;
export default organizationGuideSlice.reducer;

// THUNK

//1. API call to create tour guide
export function createGuide(data: IOrganizationGuide) {
  return async function createGuideThunk(dispactch: AppDispatch) {
    dispactch(setStatus(Status.LOADING));
    dispactch(setError(null));
    try {
      const formData = new FormData();
      formData.append("guideName", data.guideName);
      formData.append("guideEmail", data.guideEmail);
      formData.append("guidePhoneNumber", data.guidePhoneNumber);
      formData.append("guideAddress", data.guideAddress);
      formData.append("guideSalary", data.guideSalary.toString());

      if (data.guideImage) {
        formData.append("guideImage", data.guideImage);
      }
      formData.append("tourId")



      const response = await API.post("/organization/guide", data);
      if (response.status === 200) {
        dispactch(setStatus(Status.SUCCESS));
        dispactch(setError(null));
      } else {
        dispactch(setStatus(Status.ERROR));
        dispactch(setError("Failed to create guide"));
      }
    } catch (error: any) {
      console.log(error);
      dispactch(
        setError(error.response?.data?.message || "Failed to create guide")
      );
    }
  };
}
