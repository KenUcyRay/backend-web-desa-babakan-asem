import { Role, User } from "@prisma/client";

export interface RegisterUserRequest {
  name: string;
  email?: string;
  phone_number?: string;
  password: string;
  confirm_password: string;
  remember_me: boolean;
  recaptcha_token: string;
}
export interface LoginUserRequest {
  email?: string;
  phone_number?: string;
  password: string;
  remember_me: boolean;
  recaptcha_token: string;
}
export interface UpdateUserRequest {
  name?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}
export interface CreateUserRequest {
  name: string;
  phone_number?: string;
  email?: string;
  password: string;
  confirm_password: string;
  role: Role;
}
export interface UpdateRoleUserRequest {
  role: Role;
}

export interface UserForgotPasswordRequest {
  email: string;
}

export interface UserResetPasswordRequest {
  password: string;
  confirm_password: string;
}

export interface QueryUser {
  page?: number;
  size?: number;
  role?: Role;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  role: Role;
  created_at: Date;
  updated_at: Date;
  emergency_change: number;
}
export interface UserAllResponse {
  size: number;
  total_page: number;
  current_page: number;
  data: UserResponse[];
}
export const toUserResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
    emergency_change: user.emergency_change,
  };
};
export const toUserAllResponse = (
  size: number,
  total: number,
  currentPage: number,
  users: User[]
): UserAllResponse => {
  return {
    size: size,
    total_page: Math.floor(total / size),
    current_page: currentPage,
    data: users.map(toUserResponse),
  };
};
