import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth-slice";
import organizationSlice from "./organization/organization-slice";
import organizationCategorySlice from "./organization/category/category-slice";
import organizationTourSlice from "./organization/tour/tour-slice";
import organizationGuideSlice from "./organization/guide/guide-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    organization: organizationSlice,
    organizationCategory: organizationCategorySlice,
    organizationTour: organizationTourSlice,
    organizationGuide: organizationGuideSlice,
  },
});

// react-reduxt --> hooks --> useDispacth, useSelector

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
