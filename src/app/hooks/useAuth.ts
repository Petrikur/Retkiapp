import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
  AuthError,
} from "firebase/auth";
import { auth, googleProvider } from "@/app/auth/firebase/config";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const handleFirebaseError = (err: AuthError) => {
    switch (err.code) {
      case "auth/weak-password":
        setError("Password is too weak");
        break;
      case "auth/email-already-in-use":
        setError("Email already in use");
        break;
      case "auth/invalid-email":
        setError("Invalid email address");
        break;
      case "auth/user-not-found":
        setError("No user found with this email");
        break;
      case "auth/wrong-password":
        setError("Incorrect password");
        break;
      default:
        setError(err.message);
    }
    throw err;
  };

  const signup = async (email: string, password: string) => {
    try {
      setError(null);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  const logout = () => signOut(auth);

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return "Password reset email sent";
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  return {
    user,
    error,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    loading,
  };
}
