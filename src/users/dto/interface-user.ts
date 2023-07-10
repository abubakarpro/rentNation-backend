export interface IUserResponse {
  user: IUser;
  accessToken: string;
  message?: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  address?: string;
  role: string;
}
