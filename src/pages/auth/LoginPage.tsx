import googleLogo from "@/assets/googleicon.png";
import backgroundImage from '@/assets/dis7.webp';
import Logo from "@/assets/samarthanam_logo_nobg.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebaseConfig";
import { useSignUpWithGoogleMutation } from "@/services/auth";
import { formatFirebaseError } from "@/utils/formattedError";
import { GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import useLanguage from "@/lib/hooks/useLang";


const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, loading, authError] = useAuthState(auth);
  const { mutate: signIn, isPending } = useSignUpWithGoogleMutation();
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
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
    return <div className="text-center p-4">{t("loading_")}</div>;
  }

  if (authError) {
    console.log(authError.message);
    
    return (
      <div className="text-red-500 text-center p-4">{t("error_")}{formatFirebaseError(authError.message)}
      </div>
    );
  }
  

  if (user) {
    navigate("/");
    return null;
  }

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen p-4">
    //   {/* <img src={Logo} alt="Samarthanam Logo" className="h-20 w-auto mb-4" /> */}
    //   <Link to="/">
    //     <img src={Logo} alt="Samarthanam Logo" className="h-20 w-auto mb-4" />
    //   </Link>
    //   <h2 className="text-2xl font-semibold mb-6">{t("login")}</h2>
    //   <form
    //     onSubmit={handleLogin}
    //     className="flex flex-col space-y-4 w-80"
    //     aria-labelledby="login-heading"
    //   >
    //     {/* Email Input */}
    //     <label htmlFor="email" className="sr-only">{t("email")}</label>
    //     <Input
    //       id="email"
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //       aria-required="true"
    //     />

    //     {/* Password Input */}
    //     <label htmlFor="password" className="sr-only">{t("password")}</label>
    //     <Input
    //       id="password"
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //       aria-required="true"
    //     />

    //     {/* Submit Button */}

    //     <Button disabled={isPending || loading} type="submit">{t("login")}</Button>

    //     {/* Google Login Button */}
    //     <Button
    //       type="button"
    //       variant="outline"
    //       onClick={handleGoogleLogin}
    //       disabled={isPending || loading}
    //       aria-label="Sign in with Google"
    //     >
    //       <img src={googleLogo} alt="Google Logo" className="h-6 w-6 mr-2" />{t("login_with_google")}</Button>
    //   </form>
    //   {/* Display error messages for screen readers */}
    //   {error && (
    //     <p className="text-red-500 mt-2" role="alert" aria-live="assertive">
    //       {error}
    //     </p>
    //   )}
    //   {/* Signup Link */}
    //   <p className="mt-4">{t("don_t_have_an_account_")}<Button variant="link" onClick={() => navigate("/signup")}>{t("sign_up")}</Button>
    //   </p>
    //   {/* 🔹 Return to Home Button */}
    //   <Button
    //     variant="ghost"
    //     onClick={() => navigate("/")}
    //     className="text-blue-600 underline"
    //     aria-label="Return to Home"
    //   >{t("return_to_home")}</Button>
    // </div>

    // <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div
  className=" flex justify-end items-center relative min-h-screen bg-cover bg-center pr-10"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover', // Ensures the image covers the entire screen
    backgroundRepeat: 'no-repeat', // Prevents the image from repeating
    backgroundPosition: 'center', // Centers the image
  }}
    >
    
  {/* Overlay for better contrast */}
  <div className="absolute inset-0 bg-black bg-opacity-60"></div>

  {/* Login Form */}
  <div className="relative mr-20 z-10 flex flex-col rounded-3xl items-center justify-center w-min h-min bg-white p-12 pt-6 pb-6">
    <Link to="/">
      <img src={Logo} alt="Samarthanam Logo" className="h-20 w-auto mb-4" />
    </Link>
    <h2 className="text-2xl font-semibold mb-6 text-black">{t("login")}</h2>
    <form
      onSubmit={handleLogin}
      className="flex flex-col space-y-4 w-80 bg-white p-9 pr-8 pl-8 rounded-lg shadow-lg border"
      aria-labelledby="login-heading"
    >
      {/* Email Input */}
      <label htmlFor="email" className="sr-only">{t("email")}</label>
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
      <label htmlFor="password" className="sr-only">{t("password")}</label>
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
      <Button disabled={isPending || loading} type="submit">{t("login")}</Button>

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isPending || loading}
        aria-label="Sign in with Google"
      >
        <img src={googleLogo} alt="Google Logo" className="h-6 w-6 mr-2" />
        {t("login_with_google")}
      </Button>
    </form>

    {/* Display error messages for screen readers */}
    {error && (
      <p className="text-red-500 mt-2" role="alert" aria-live="assertive">
        {error}
      </p>
    )}

    {/* Signup Link */}
    <p className="mt-4 text-red-500 hover:text-red-600">
      {t("don_t_have_an_account_")}
      <Button variant="link" onClick={() => navigate("/signup")}>{t("sign_up")}</Button>
    </p>

    {/* Return to Home Button */}
    <Button
      variant="ghost"
      onClick={() => navigate("/")}
      className="text-blue-300 underline"
      aria-label="Return to Home"
    >
      {t("return_to_home")}
    </Button>
  </div>
</div>
  );
};

export default LoginPage;
