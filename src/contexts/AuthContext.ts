import { createContext } from "react";

type AuthContextType = {
  loading: boolean;
  user: any | null;
  accessToken: string | null;
  login: ({ email, password }: any) => Promise<boolean>;
  signup: ({ email, password }: any) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  loading: false,
  user: null,
  accessToken: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
});
