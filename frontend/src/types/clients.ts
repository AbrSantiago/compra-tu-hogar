export interface ClientCreate {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface ClientUpdate {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}