
export const formatFirebaseError = (error: unknown) => {
  if (typeof error === "string") {
    const errorMessages: { [key: string]: string } = {
      "auth/invalid-email": "Invalid email format",
      "auth/invalid-credential": "Invalid Credentials",
      "auth/user-disabled": "This account has been disabled",
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password, try again",
      "auth/email-already-in-use": "This email is already registered",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/network-request-failed": "Network error, check your connection",
    };
    return errorMessages[error] || error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
};