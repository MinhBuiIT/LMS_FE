import { IUser } from './user';

export interface ResponseType<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: IUser;
}

export interface ResendVerifyEmailResponse extends RegisterResponse {}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: IUser;
}

export interface SocialLoginBody {
  name: string;
  email: string;
  avatar: string;
}
