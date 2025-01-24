import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
  AuthError,
  getIdToken as firebaseGetIdToken,
} from "firebase/auth";
import { auth, googleProvider } from "@/app/auth/firebase/config";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // Force refresh the token to include any updated claims
        await currentUser.getIdToken(true);

        // Get custom claims (including the role)
        const idTokenResult = await currentUser.getIdTokenResult();

        // Check if role exists in claims and set it safely
        if (
          idTokenResult.claims &&
          typeof idTokenResult.claims.role === "string"
        ) {
          setRole(idTokenResult.claims.role); // Set role if it's a string
        } else {
          setRole(null); // If no role found, set it to null
        }
      }

      setUser(currentUser);
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

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Force refresh the token to get updated custom claims
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true); // Force refresh of the ID token
      }

      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to sync user");
      }

      // Set the role after successful login
      const idTokenResult = await userCredential.user.getIdTokenResult();
      if (
        idTokenResult.claims &&
        typeof idTokenResult.claims.role === "string"
      ) {
        setRole(idTokenResult.claims.role);
      } else {
        setRole(null);
      }

      return userCredential;
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Force refresh the token to get updated custom claims
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true); // Refresh token
      }

      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to sync user");
      }

      // Set the role after successful signup
      const idTokenResult = await userCredential.user.getIdTokenResult();
      if (
        idTokenResult.claims &&
        typeof idTokenResult.claims.role === "string"
      ) {
        setRole(idTokenResult.claims.role); // Set role only if it's a string
      } else {
        setRole(null); // Set to null if no valid role
      }

      return userCredential;
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);

      const userCredential = await signInWithPopup(auth, googleProvider);

      // Force refresh the token to get updated custom claims
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true); // Refresh token
      }

      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to sync user");
      }

      // Set the role after successful login with Google
      const idTokenResult = await userCredential.user.getIdTokenResult();
      if (
        idTokenResult.claims &&
        typeof idTokenResult.claims.role === "string"
      ) {
        setRole(idTokenResult.claims.role); // Set role only if it's a string
      } else {
        setRole(null); // Set to null if no valid role
      }

      return userCredential;
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  const logout = () => {
    setRole(null); // Clear the role when the user logs out
    return signOut(auth);
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return "Password reset email sent";
    } catch (err) {
      handleFirebaseError(err as AuthError);
    }
  };

  const getIdToken = async () => {
    if (user) {
      return await firebaseGetIdToken(user);
    }
    return null;
  };

  return {
    user,
    error,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    getIdToken,
    loading,
    role,
  };
}
