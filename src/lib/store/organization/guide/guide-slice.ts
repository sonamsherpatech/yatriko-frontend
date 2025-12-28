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
  currentGuide: null,
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
    setCurrentGuide(
      state: IOrganizationGuideInitialState,
      action: PayloadAction<IOrganizationGuide | null>
    ) {
      state.currentGuide = action.payload;
    },
    setGuideDelete(
      state: IOrganizationGuideInitialState,
      action: PayloadAction<string | undefined>
    ) {
      if (!action.payload) return;
      const guideId = action.payload;
      const index = state.guide.findIndex((g) => g.id === guideId);
      if (index !== -1) {
        state.guide.splice(index, 1);
      }
    },
    setUpdateGuideStatus(
      state: IOrganizationGuideInitialState,
      action: PayloadAction<{ status: string; id?: string }>
    ) {
      const { status, id } = action.payload;

      const guide = state.guide.find((g) => g.id === id);

      if (guide) {
        guide.guideStatus = status;
      }

      if (state.currentGuide && state.currentGuide?.id === id) {
        state.currentGuide.guideStatus = status;
      }
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

export const {
  setGuide,
  setStatus,
  setGuideDelete,
  setCurrentGuide,
  setUpdateGuideStatus,
  setError,
  resetStatus,
} = organizationGuideSlice.actions;
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
      formData.append("tourId", data.tourId);

      const response = await API.post("/organization/guide", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

//2. API call to fetch guides
export function getGuides() {
  return async function getGuidesThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.get("/organization/guide");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        response.data.data.length > 0 && dispatch(setGuide(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to fetch guide"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch guide")
      );
    }
  };
}

// 3. API Call to delete guide
export function deleteGuide(id?: string) {
  return async function deleteGuideThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.delete(`/organization/guide/${id}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
        dispatch(setGuideDelete(id));
        dispatch(getGuides());
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to delete guide"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to delete error")
      );
    }
  };
}

//4. API call to fetch guide by id
export function getGuideById(id?: string) {
  return async function getGuideByIdThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.get(`/organization/guide/${id}`);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));

        const guideData = response.data.data;
        if (guideData) {
          dispatch(
            setCurrentGuide(Array.isArray(guideData) ? guideData[0] : guideData)
          );
        }
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to fetch guide"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(setError(error || "Failed to fetch guide"));
    }
  };
}

//5. API call to update guide status
export function updateGuideStatusById(guideStatus: string, id?: string) {
  return async function updateGuideStatusByIdThunks(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.patch(`/organization/guide/${id}`, {
        guideStatus,
      });
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));

        dispatch(setUpdateGuideStatus({ status: guideStatus, id }));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to update guide status"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(setError(error || "Failed to updated guide"));
    }
  };
}
