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
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    assigned: 0,
    available: 0,
  },
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
    setStats(
      state: IOrganizationGuideInitialState,
      action: PayloadAction<any>
    ) {
      state.stats = action.payload;
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
      action: PayloadAction<{
        status?: "active" | "inactive" | "suspended";
        id?: string;
      }>
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
  setStats,
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
      formData.append("guideSalary", data.guideSalary?.toString() || "0");

      if (data.guideImage && data.guideImage instanceof File) {
        formData.append("guideImage", data.guideImage);
      }
      if (data.tourId) {
        formData.append("tourId", data.tourId);
      }

      const response = await API.post("/organization/guide", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201 || response.status === 200) {
        dispactch(setStatus(Status.SUCCESS));
        dispactch(setError(null));
      } else {
        dispactch(setStatus(Status.ERROR));
        dispactch(setError("Failed to create guide"));
      }
    } catch (error: any) {
      console.log("Create guide error:", error);
      dispactch(setStatus(Status.ERROR));
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
        if (response.data.data && response.data.data.length > 0) {
          dispatch(setGuide(response.data.data));
        }

        if (response.data.stats) {
          dispatch(setStats(response.data.stats));
        }
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to fetch guide"));
      }
    } catch (error: any) {
      console.log("Fetch guides error:", error);
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
      console.error("Fetch guide error:", error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch guide")
      );
    }
  };
}

//5. API call to update guide status
export function updateGuideStatusById(
  guideStatus?: "active" | "inactive" | "suspended",
  id?: string
) {
  return async function updateGuideStatusByIdThunks(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.patch(`/organization/guide/${id}/status`, {
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

//6. API call to update guide
export function updateGuide(payload: { guideId: string; data: FormData }) {
  return async function updateGuideThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));
    try {
      const response = await API.put(
        `/organization/guide/${payload.guideId}`,
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
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to update guide"));
      }
    } catch (error: any) {
      console.log("Update guide error: ", error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message || "Failed to update guide")
      );
    }
  };
}

//7. API call to assign guide to tour
export function assignGuideToTour(guideId: string, tourId: string) {
  return async function assignGuideToTourThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));

    try {
      const response = await API.post(`/organization/guide/assign`, {
        guideId,
        tourId,
      });

      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to assign guide to tour"));
      }
    } catch (error: any) {
      console.error("Assign Tour error:", error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(
          error.response?.data?.message || "Failed to assign guide to tour"
        )
      );
    }
  };
}



//8. API call to unassign guide from tour
export function unassignGuideFromTour(guideId: string) {
  return async function unassignGuideFromTourThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));

    try {
      const response = await API.patch(
        `/organization/guide/${guideId}/unassign`
      );

      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to unassign guide from tour"));
      }
    } catch (error: any) {
      console.error("Unassigned guide error: ", error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(
          error.response?.data?.message || "Failed to unassign guide from tour"
        )
      );
    }
  };
}

//9. API call to get available guides
export function getAvailableGuides() {
  return async function getAvailableGuidesThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    dispatch(setError(null));

    try {
      const response = await API.get(`/organization/guide/available`);

      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));

        if (response.data.data && response.data.data.length > 0) {
          dispatch(setGuide(response.data.data));
        }
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to get available guides"));
      }
    } catch (error: any) {
      console.log("Available Guides error: ", error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(
          error.response?.data?.message || "Failed to get available guides"
        )
      );
    }
  };
}
