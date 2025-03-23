import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { setUserDetails } from "@/store/slices/user-slice";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useGetUserProfile = ({ isEnabled }: { isEnabled: boolean }) => {
    
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async function fetchProfile() {
      const response: ApiResponseFormat = await axiosClient.get(
        "/user/get-profile"
      );
      if (response.status === ResponseStatusType.Success) {
        dispatch(setUserDetails(response.result));
        return response.result;
      }

      return null;
    },
    enabled: isEnabled,
  });
};

export const useGetMyApplications = ({ isEnabled }: { isEnabled: boolean }) => {


  return useQuery({
    queryKey: ["myApplications"],
    queryFn: async function fetchProfile() {
      const response: ApiResponseFormat = await axiosClient.get(
        "/application"
      );
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }

      return null;
    },
    enabled: isEnabled,
  });
};
