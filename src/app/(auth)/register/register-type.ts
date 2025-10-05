import { StaticImageData } from "next/image";

export interface IRegisterType {
  username: string;
  email: string;
  password: string;
}

export interface IRegisterTypes extends IRegisterType {
  confirmPassword: string;
}

export interface ICoverSignupImage {
  coverSignupImage: string | StaticImageData;
}
