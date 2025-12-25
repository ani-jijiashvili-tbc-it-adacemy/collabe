import { User } from '../../../shared/models/user.model';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
export interface UserResponse extends User {}

export interface SignInResponse {
  token: string;
  user: User;
}

export interface SignUpResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
