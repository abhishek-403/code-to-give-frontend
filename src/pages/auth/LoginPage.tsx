import backgroundImage from "@/assets/dis7.webp";
import googleLogo from "@/assets/googleicon.png";
import Logo from "@/assets/samarthanam_logo_nobg.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebaseConfig";
import useLanguage from "@/lib/hooks/useLang";
import { useSignUpWithGoogleMutation } from "@/services/auth";
import { formatFirebaseError } from "@/utils/formattedError";
import { GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, loading, authError] = useAuthState(auth);
  const { mutate: signIn, isPending } = useSignUpWithGoogleMutation();
  const { t } = useLanguage();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    signIn();
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900"
        role="status"
        aria-live="polite"
      >
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary dark:border-primary-light mx-auto mb-4"></div>
          <p className="text-lg text-gray-800 dark:text-gray-200">
            {t("loading_")}
          </p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div
        className="flex items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-red-500 dark:text-red-400 text-center p-4 max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg shadow-sm">
          <h2 className="font-bold text-lg mb-2">{t("error_")}</h2>
          <p>{formatFirebaseError(authError.message)}</p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
            aria-label="Try again"
          >
            {t("try_again")}
          </Button>
        </div>
      </div>
    );
  }

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div
      className="flex justify-end items-center min-h-screen bg-cover bg-center relative transition-colors duration-200 pr-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better contrast and readability */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 dark:bg-opacity-75"
        aria-hidden="true"
      ></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-colors duration-200 mr-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" aria-label="Return to homepage">
            <img
              src={Logo}
              alt="Samarthanam Logo"
              className="h-20 w-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
            {t("login")}
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
          aria-labelledby="login-heading"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("email")}
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("password")}
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-red-600 dark:text-red-400">
                {formatFirebaseError(error)}
              </p>
            </div>
          )}

          {/* Login Button */}
          <Button
            disabled={isPending || loading}
            type="submit"
            className="w-full py-2"
            aria-busy={isPending || loading}
          >
            {isPending || loading ? t("logging_in") : t("login")}
          </Button>

          {/* Divider */}
          <div className="relative my-4">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {t("or")}
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isPending || loading}
            aria-label="Sign in with Google"
            className="w-full py-2 flex justify-center items-center"
          >
            <img
              src={googleLogo}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 mr-2"
            />
            <span>{t("login_with_google")}</span>
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("don_t_have_an_account_")}
            <Button
              variant="link"
              onClick={() => navigate("/signup")}
              className="text-primary dark:text-primary-light font-medium hover:text-primary-dark dark:hover:text-primary-lighter ml-1"
            >
              {t("sign_up")}
            </Button>
          </p>
        </div>

        {/* Return to Home Button */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Return to Home"
          >
            {t("return_to_home")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
