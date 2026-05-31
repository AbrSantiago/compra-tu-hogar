export interface AdminCreate {
  name: string;
  email: string;
  password: string;
}

export interface AdminUpdate {
  name?: string;
  email?: string;
  password?: string;
}