import { createContext } from "react";

export const AuthContext = createContext<any>({
  loading: false,
  user: null,
  accessToken: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateAcProfile: async () => {},
});
