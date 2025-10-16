import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserData, IUserInitialState } from "./auth-slice-types";
import { Status } from "@/lib/types";
import API from "@/lib/http";
import { IRegisterType } from "@/app/(auth)/register/register-type";
import { AppDispacth } from "../store";
import { ILoginType } from "@/app/(auth)/login/login-type";

const initialState: IUserInitialState = {
  user: {
    username: "",
  },
  status: Status.IDLE,
  token: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser(state: IUserInitialState, action: PayloadAction<IUserData>) {
      state.user = action.payload;
    },
    setStatus(state: IUserInitialState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setToken(state: IUserInitialState, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setError(state: IUserInitialState, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setReset(state: IUserInitialState) {
      state.status = Status.IDLE;
      state.error = null;
    },
    logout(state: IUserInitialState) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = { username: "" };
      state.status = Status.IDLE;
      state.error = null;
      if (typeof window != "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setStatus, setUser, setToken, setError, setReset, logout } =
  authSlice.actions;
export default authSlice.reducer;

//api call --> custom thunk

export function registerUser(data: IRegisterType) {
  return async function registerUserThunk(dispatch: AppDispacth) {
    dispatch(setReset());
    try {
      const response = await API.post("/register", data);
      if (response.status === 201) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Registration Failed"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message) || "Registration failed"
      );
    }
  };
}

export function loginUser(data: ILoginType) {
  return async function loginUserThunk(dispatch: AppDispacth) {
    dispatch(setReset());
    try {
      const response = await API.post("/login", data);
      if (response.status === 200) {
        //settting user data
        dispatch(setUser(response.data.data));

        //setting token
        const { token } = response.data;
        dispatch(setToken(token));
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setError(null));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Login Failed"));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      dispatch(
        setError(error.response?.data?.message) || "Invalid Credentials"
      );
    }
  };
}

export function checkAuth() {
  return async function checkAuthThunk(dispatch: AppDispacth) {
    if (typeof window !== undefined) {
      const token = localStorage.getItem("token");

      if (token) {
        dispatch(setToken(token));
        dispatch(setStatus(Status.SUCCESS));
      }
    }
  };
}
