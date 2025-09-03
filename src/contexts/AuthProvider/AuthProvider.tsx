import { useState, useEffect, useCallback } from "react";
import { auth } from "@/utils/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { AuthContext } from "../AuthContext";
import { toast } from "sonner";

const ERROR_MESSAGES = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Try again.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "Firebase: Error (auth/invalid-credential).": "Invalid login credentials.",
  "Firebase: Error (auth/email-already-in-use).":
    "User already exist with this email address.",
} as any;

export default function AuthProvider({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  // --------------------- Login ------------------
  const login = useCallback(async ({ email, password }: any) => {
    setAuthLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      console.log(res, "login res");
      const token = await res.user.getIdToken();

      setUser(res.user);
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
      return { success: true, message: "Login Successful" };
    } catch (error: any) {
      console.error("Login failed", error);
      const friendlyMessage =
        ERROR_MESSAGES[error.message] ||
        "Something went wrong. Please try again.";
      // console.log(error.message);
      // console.log(friendlyMessage);
      return { success: false, message: friendlyMessage };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ---------------------- Signup
  const signup = useCallback(async ({ name, email, image, password }: any) => {
    setAuthLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: image,
        });
      }

      setUser(res.user);
      setAccessToken(token);
      localStorage.setItem("accessToken", token);

      return { success: true, message: "Signup successful" };
    } catch (error: any) {
      console.error("Signup failed", error);
      const friendlyMessage =
        ERROR_MESSAGES[error.message] ||
        "Something went wrong. Please try again.";
      return { success: false, message: friendlyMessage };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const updateAcProfile = useCallback(
    async ({ displayName, photoURL }: any) => {
      setAuthLoading(true);
      try {
        if (!auth.currentUser) {
          return { success: false, message: "No user logged in" };
        }

        await updateProfile(auth.currentUser, {
          displayName,
          photoURL,
        });

        // ✅ update local state
        setUser({
          ...auth.currentUser,
          displayName,
          photoURL,
        });

        return { success: true, message: "Profile updated successfully" };
      } catch (error: any) {
        console.error("Profile update failed:", error);
        return { success: false, message: error.message };
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  // --------------------- Logout
  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, try again.");
    } finally {
      setAuthLoading(false);
    }
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
      value={{
        user,
        accessToken,
        loading,
        authLoading,
        login,
        signup,
        logout,
        updateAcProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
