export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  status?: string;
}

export type UpdateUserDto = {
  name?: string;
  email?: string;
  status?: string;
}

export type User = {
  id: any,
  email: string,
  name: string,
  status: string,
  serveNumber: number,
  createdAt: string,
}
