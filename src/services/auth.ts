import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { auth, googleAuthProvider } from "@/lib/firebaseConfig";
import { formatFirebaseError } from "@/utils/formattedError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

export const useGetUserProfile = ({ isEnabled }: { isEnabled: boolean }) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async function fetchProfile() {
      const response: ApiResponseFormat = await axiosClient.get(
        "/user/get-profile"
      );
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }

      return null;
    },
    enabled: isEnabled,
  });
};

export const useSignUpWithGoogleMutation = () => {
  return useMutation<any, void>({
    mutationFn: async () => {
      const { user } = await signInWithPopup(auth, googleAuthProvider);

      const response: ApiResponseFormat = await axiosClient.post(
        "/user/google-login",
        {
          displayName: user.displayName,
          email: user.email,
          profileImage: user.photoURL,
        }
      );

      if (response.status === ResponseStatusType.Error) {
        await auth.signOut();
      }
      return user;
    },
    onSuccess: (user) => {
      toast.success(`Welcome, ${user.displayName}! 🎉`);
    },
    onError: (error) => {
      console.log(error);
      toast.error(`Sign-in failed`);
    },
  });
};

export const useSignUpWithEmailPasswordMutation = () => {
  return useMutation<
    void,
    Error,
    { name: string; email: string; password: string }
  >({
    mutationFn: async ({ email, password, name }) => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const response: ApiResponseFormat = await axiosClient.post(
          `/user/create-user`,
          {
            email,
            displayName: name,
          }
        );

        if (response.status === ResponseStatusType.Error) {
          await auth.signOut();

          throw new Error("User creation failed in backend.");
        }
      } catch (error) {
        throw new Error(formatFirebaseError(error));
      }
    },
    onSuccess: (_, variables) => {
      toast.success(`Welcome, ${variables.name}! 🎉`);
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Sign-up failed: ${error.message}`);
    },
  });
};
