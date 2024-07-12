import { TodoList } from ".prisma/client";

export interface RegisterData {
  email: string;
  password: string;
  passwordConfirmation: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  email: string;
  todoLists: TodoList[];
}
