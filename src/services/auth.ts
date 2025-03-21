import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { auth, googleAuthProvider } from "@/lib/firebaseConfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get("/user/get-profile");
        return response.data.result;
      } catch (error) {
        console.log(error);
      }
    },
  });
};

const googleSignUp = async () => {
  console.log("hi");

  const { user } = await signInWithPopup(auth, googleAuthProvider);
  console.log(user.photoURL);

  const response: ApiResponseFormat = await axiosClient.post(
    "/user/google-login",
    {
      name: user.displayName,
      email: user.email,
      profileImage: user.photoURL,
    }
  );

  if (response.status === ResponseStatusType.Error) {
    await auth.signOut();
  }
  return user;
};
export const useSignUpWithGoogleMutation = () => {
  return useMutation<any, void>({
    mutationFn: googleSignUp,
    onSuccess: (user) => {
      toast.success(`Welcome, ${user.displayName}! 🎉`);
    },
    onError: (error) => {
      console.log(error);
      toast.error(`Sign-in failed`);
    },
  });
};
