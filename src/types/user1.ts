export interface User {
  id: number;
  name: string;
  email: string;
  role:string;
  mustChangePassword: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}