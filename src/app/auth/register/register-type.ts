import { StaticImageData } from "next/image";

export interface IRegisterTypes {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ICoverSignupImage {
    coverSignupImage : string | StaticImageData
}