"use client";
import { checkAuth } from "@/lib/store/auth/auth-slice";
import store from "@/lib/store/store";
import { useEffect } from "react";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
