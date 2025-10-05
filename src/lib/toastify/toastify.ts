"use client";

import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

interface IToastify {
  text: string;
  duration?: number;
  gravity?: "top" | "bottom";
  position?: "left" | "center" | "right";
  style?: { [key: string]: string };
}

export const showToast = ({
  text,
  duration = 1000,
  gravity = "top",
  position = "right",
  style = {},
}: IToastify) => {
  Toastify({
    text,
    duration,
    gravity,
    position,
    style,
  }).showToast();
};
