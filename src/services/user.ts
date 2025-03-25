import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { TaskStatus } from "@/lib/constants/server-constants";
import { useAppDispatch } from "@/store";
import { setUserDetails } from "@/store/slices/user-slice";
import { Task } from "@/types/event";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Types } from "mongoose";
import toast from "react-hot-toast";

export const useGetUserProfile = ({ isEnabled }: { isEnabled: boolean }) => {
  const dispatch = useAppDispatch();

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
      const response: ApiResponseFormat = await axiosClient.get("/application");
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }

      return null;
    },
    enabled: isEnabled,
  });
};

export const useVolunteerEventTasks = (
  eventId: string | undefined,
  isEnabled: boolean
) => {
  return useQuery({
    queryKey: ["volunteerEventTasks", eventId],
    queryFn: async function fetchData(): Promise<Task[]> {
      const response: ApiResponseFormat = await axiosClient.get(
        `/volunteer/event/${eventId}`
      );
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }

      return [];
    },
    enabled: isEnabled,
  });
};
export const useUpdateVolunteerEventTasksStatus = () => {
  return useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: Types.ObjectId;
      status: TaskStatus;
    }) => {
      const response: ApiResponseFormat = await axiosClient.post(
        `/volunteer/event/task/${taskId}`,
        { status }
      );
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }
      throw new Error(response.result);
    },
    onSuccess: async (_, __) => {
      toast.success(`Task status updated!`);
    },

    onError: (error) => {
      console.error("Volunteering domain creation error:", error);
      toast.error(error.message ?? "Error");
    },
  });
};

export const useGetVolunteerHistoryEvents = ({
  isEnabled,
}: {
  isEnabled: boolean;
}) => {
  return useQuery({
    queryKey: ["myHistoryApplications"],
    queryFn: async () => {
      const response: ApiResponseFormat = await axiosClient.get("/volunteer/event-history");
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }
      
      return [];
    },
    enabled: isEnabled,
  });
};
