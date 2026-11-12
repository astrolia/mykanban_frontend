export interface createUserType{
    name: string;
    email: string;
    password: string;
}

export type UserResponseType = {
  name: string
  email: string
}

export type UpdateUserType = {
  name: string
  email: string
}

export type ChangePasswordType = {
  currentPassword: string
  newPassword: string
}