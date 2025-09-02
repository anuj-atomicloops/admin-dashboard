import { useState, useEffect, useCallback } from "react";
import { auth } from "@/utils/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { AuthContext } from "../AuthContext";
import { toast } from "sonner";

const ERROR_MESSAGES = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Try again.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "Firebase: Error (auth/invalid-credential).": "Invalid login credentials",
} as any;

export default function AuthProvider({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  // ---------------- Login
  const login = useCallback(async ({ email, password }: any) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      console.log(res, "login res");
      const token = await res.user.getIdToken();

      setUser(res.user);
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
      return { success: true, message: "Login Successfull" };
    } catch (error: any) {
      console.error("Login failed", error);
      const friendlyMessage =
        ERROR_MESSAGES[error.message] ||
        "Something went wrong. Please try again.";
      console.log(error.message);
      console.log(friendlyMessage);
      return { success: false, message: friendlyMessage };
    }
  }, []);

  // ---------------------- Signup
  const signup = useCallback(async ({ email, password }: any) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();

      setUser(res.user);
      setAccessToken(token);
      localStorage.setItem("accessToken", token);

      return true;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  }, []);

  // --------------------- Logout
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    toast.success("Logout successfull");
  }, []);

  // ------------------ Listen to user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        setUser(currentUser);
        setAccessToken(token);
        localStorage.setItem("accessToken", token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
