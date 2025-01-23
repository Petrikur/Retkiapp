"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { useAuth } from "@/app/hooks/useAuth";
import { showToast } from "@/app/Components/Toast/Toast";
import { UserCredential } from "firebase/auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loadingType, setLoadingType] = useState<
    "none" | "login" | "signup" | "google"
  >("none");
  const { login, signup, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleAuthAction = async (
    authAction: () => Promise<UserCredential | undefined>,
    loadingType: "login" | "signup" | "google",
    successMessage: string = "Kirjautuminen onnistui",
    errorMessage: string = "Kirjautuminen epäonnistui"
  ) => {
    setLoadingType(loadingType);
    try {
      await authAction();
      showToast(successMessage, true);
      router.push("/");
    } catch (err) {
      console.log("Auth action failed:", err);
      showToast(errorMessage, false);
    } finally {
      setLoadingType("none");
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAuthAction(() => login(email, password), "login");
  };

  const handleSignup = () => {
    handleAuthAction(() => signup(email, password), "signup");
  };

  const handleGoogleSignIn = () => {
    handleAuthAction(() => signInWithGoogle(), "google");
  };

  const isLoading = loadingType !== "none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login / Signup
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-2 rounded transition-colors flex items-center justify-center ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loadingType === "login" ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  Login
                </>
              ) : (
                "Login"
              )}
            </button>
            <button
              type="button"
              onClick={handleSignup}
              disabled={isLoading}
              className={`flex-1 py-2 rounded transition-colors flex items-center justify-center ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {loadingType === "signup" ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  Signup
                </>
              ) : (
                "Signup"
              )}
            </button>
          </div>
          <div className="text-center mt-4">
            <div className="mb-2">or</div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full flex items-center justify-center border rounded py-2 transition-colors ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "hover:bg-red-700"
              } text-white`}
            >
              {loadingType === "google" ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  Sign in with Google
                </>
              ) : (
                <>
                  <FaGoogle className="mr-2" />
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
