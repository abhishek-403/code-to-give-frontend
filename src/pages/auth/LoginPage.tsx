import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Logo from "@/assets/samarthanam_logo_nobg.png";
import googleLogo from "@/assets/googleicon.png";

// Create a single GoogleAuthProvider instance (Efficiency)
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, loading, authError] = useAuthState(auth);

  // Handle Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to home on successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setError(null); // Clear previous errors
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/"); // Redirect on success
    } catch (err: any) {
      if (err.code === "auth/popup-blocked") {
        // Fallback for pop-up blocker issue
        await signInWithRedirect(auth, googleProvider);
      } else {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (authError) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {authError.message}
      </div>
    );
  }

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* <img src={Logo} alt="Samarthanam Logo" className="h-20 w-auto mb-4" /> */}
			<Link to="/">
				<img src={Logo} alt="Samarthanam Logo" className="h-20 w-auto mb-4" />
			</Link>

      <h2 className="text-2xl font-semibold mb-6">Login</h2>

      <form
        onSubmit={handleLogin}
        className="flex flex-col space-y-4 w-80"
        aria-labelledby="login-heading"
      >
        {/* Email Input */}
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
        />

        {/* Password Input */}
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
        />

        {/* Submit Button */}
        <Button type="submit">Login</Button>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          aria-label="Sign in with Google"
        >
          <img src={googleLogo} alt="Google Logo" className="h-6 w-6 mr-2" />
          Login with Google
        </Button>
      </form>

      {/* Display error messages for screen readers */}
      {error && (
        <p className="text-red-500 mt-2" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      {/* Signup Link */}
      <p className="mt-4">
        Don't have an account?
        <Button variant="link" onClick={() => navigate("/signup")}>
          Sign up
        </Button>
      </p>

      {/* 🔹 Return to Home Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="text-blue-600 underline"
        aria-label="Return to Home"
      >
        Return to Home
      </Button>
    </div>
  );
};

export default LoginPage;
