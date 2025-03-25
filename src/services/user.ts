import { queryClient } from "@/components/global-provider";
import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { TaskStatus } from "@/lib/constants/server-constants";
import { useAppDispatch } from "@/store";
import { setUserDetails } from "@/store/slices/user-slice";
import { Task } from "@/types/event";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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
      const response: ApiResponseFormat = await axiosClient.get(
        "/volunteer/event-history"
      );
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }

      return [];
    },
    enabled: isEnabled,
  });
};

const fetchUsers = async (context: {
  pageParam: number;
  queryKey: (string | undefined)[];
}): Promise<UsersResponse> => {
  const { pageParam } = context;
  const [, city, role, searchQuery] = context.queryKey;

  const params = new URLSearchParams();
  params.set("page", pageParam.toString());
  params.set("limit", "6");

  if (city) params.set("city", city);
  if (role) params.set("role", role);
  if (searchQuery) params.set("searchQuery", searchQuery);

  const res: ApiResponseFormat = await axiosClient.get(
    `/user/get-users?${params}`
  );

  if (res.status === "success") {
    return res.result;
  }

  return {
    users: [],
    pagination: { total: 0, page: 1, limit: 6, hasMore: false },
  };
};

export interface FetchUsersParams {
  city?: string;
  role?: string;
  searchQuery?: string;
}

export interface UsersResponse {
  users: any[];
  pagination: { total: number; page: number; limit: number; hasMore: boolean };
}
export const useInfiniteUsers = ({
  city,
  role,
  searchQuery,
}: FetchUsersParams) => {
  return useInfiniteQuery({
    queryKey: ["users", city, role, searchQuery],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useChangeUserRoleMutation = () => {
  const { refetch } = useInfiniteUsers({});

  return useMutation({
    mutationFn: async ({ userId, newRole }: any) => {
      const response: ApiResponseFormat = await axiosClient.patch(
        `/users/change-role`,
        { role: newRole, userId }
      );

      if (response.status !== ResponseStatusType.Success) {
        toast.error(response.result);
        throw new Error();
      }
      toast.success(response.result);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      refetch();
    },
  });
};
