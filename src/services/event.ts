import { queryClient } from "@/components/global-provider";
import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { TaskStatus } from "@/lib/constants/server-constants";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { setEventDetails } from "@/store/slices/evet-slice";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface FetchEventsParams {
  activeTab: string;
  city?: string;
  domain?: string;
  availability?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

interface ProgramsResponse {
  events: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export const useInfiniteEvents = ({
  activeTab,
  city,
  domain,
  availability,
  startDate,
  endDate,
  searchQuery,
}: FetchEventsParams) => {
  // Define the query function with the correct parameter type
  const fetchPrograms = async (context: {
    pageParam: number;
    queryKey: (string | undefined)[];
  }): Promise<ProgramsResponse> => {
    const { pageParam } = context;

    // Build the query parameters
    const params = new URLSearchParams();
    params.set("page", pageParam.toString());
    params.set("limit", "6");

    // Add all filters
    // if (activeTab && activeTab !== "all") params.set("activeTab", activeTab);
    if (city) params.set("city", city);
    if (domain) params.set("domain", domain);
    if (availability) params.set("availability", availability);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (searchQuery) params.set("searchQuery", searchQuery);

    // Make the API call with all filters
    const res: ApiResponseFormat = await axiosClient.get(`/event?${params}`);

    if (res.status === ResponseStatusType.Success) {
      return {
        events: res.result.events,
        pagination: res.result.pagination,
      };
    }

    return {
      events: [],
      pagination: { total: 0, page: 1, limit: 6, hasMore: false },
    };
  };

  return useInfiniteQuery({
    queryKey: [
      "activeEvents",
      activeTab,
      searchQuery,
      city,
      domain,
      availability,
      startDate,
      endDate,
    ],
    queryFn: fetchPrograms,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};
export const useInfiniteEventsForAdmin = ({
  activeTab,
  city,
  domain,
  availability,
  startDate,
  endDate,
  searchQuery,
}: any) => {
  // Define the query function with the correct parameter type

  const user = useAppSelector((state: RootState) => state.user);
  const fetchPrograms = async (context: {
    pageParam: number;
    queryKey: (string | undefined)[];
  }): Promise<ProgramsResponse> => {
    const { pageParam } = context;

    // Build the query parameters
    const params = new URLSearchParams();
    params.set("page", pageParam.toString());
    params.set("limit", "6");

    // Add all filters
    // if (activeTab && activeTab !== "all") params.set("activeTab", activeTab);
    if (city) params.set("city", city);
    if (domain) params.set("domain", domain);
    if (availability) params.set("availability", availability);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (searchQuery) params.set("searchQuery", searchQuery);

    // Make the API call with all filters
    const res: ApiResponseFormat = await axiosClient.get(
      `/event-admin?${params}`
    );

    if (res.status === ResponseStatusType.Success) {
      return {
        events: res.result.events,
        pagination: res.result.pagination,
      };
    }

    return {
      events: [],
      pagination: { total: 0, page: 1, limit: 6, hasMore: false },
    };
  };

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["activeEventsAdmin"] });
    }
  }, [user, queryClient]);
  return useInfiniteQuery({
    queryKey: [
      "activeEventsAdmin",
      activeTab,
      searchQuery,
      city,
      domain,
      availability,
      startDate,
      endDate,
    ],
    queryFn: fetchPrograms,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!user,
  });
};
export const useUpdateApplicationStatusMutation = () => {
  return useMutation({
    mutationFn: async (applicationData: any) => {
      const res: ApiResponseFormat = await axiosClient.post(
        `/application/${applicationData.applicationId}/status`,
        { status: applicationData.status }
      );

      if (res.status === ResponseStatusType.Success) {
        return res.result;
      }
      throw new Error(res.result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeEventsAdmin"] });
      toast.success("Application status updated!!");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
export const useSubmitApplicationMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (applicationData: any) => {
      const res: ApiResponseFormat = await axiosClient.post(
        `/application`,
        applicationData
      );

      if (res.status === ResponseStatusType.Success) {
        return res.result;
      }
      throw new Error(res.result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      toast.success("Application Submitted Succesfully!!");
      navigate("/");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

interface EventFormData {
  name: string;
  description: string;
  location: string;
  startDate: Date; // ISO string
  endDate: Date; // ISO string
  volunteeringDomains: string[];
  availability: string[]; // Will be flattened in the mutation
  capacity: number;
  formFields: {
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
  }[];
}

interface CreateEventResponse {
  eventId: string;
  msg: string;
}
export interface TaskFormData {
  eventId: string;
  name: string;
  description?: string;
  assignedTo: string;
  assignedBy: string;
  startDate?: string;
  endDate?: string;
  status: TaskStatus;
  priority?: "low" | "medium" | "high";
}

export const useAddTaskToEventMutation = () => {
  return useMutation<any, Error, TaskFormData>({
    mutationFn: async (taskData: TaskFormData) => {
      const response: ApiResponseFormat = await axiosClient.post(
        `/event/${taskData.eventId}/task`,
        taskData
      );

      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }
      throw new Error(response.result);
    },
    onSuccess: (_, __) => {
      queryClient.invalidateQueries({ queryKey: ["activeEventsAdmin"] });
      toast.success(`Task added successfully! 🎉`);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Task creation error:", error);
      toast.error(error.message ?? "Failed");
    },
  });
};
interface CreateEventResponse {
  eventId: string;
  msg: string;
}
export const useCreateEventMutation = () => {
  return useMutation<
    CreateEventResponse, // Return type from the API
    Error, // Error type
    EventFormData // Input type
  >({
    mutationFn: async (eventData: EventFormData) => {
      const response: ApiResponseFormat = await axiosClient.post(
        "/event",
        eventData
      );

      if (response.result.status === ResponseStatusType.Success) {
        return response.result;
      }
      throw new Error(response.result);
    },
    onSuccess: (_, __) => {
      toast.success(`Event created successfully! 🎉`);
    },
    onError: (error) => {
      console.error("Event creation error:", error);
      toast.error(error.message ?? "Failed");
    },
  });
};

export const useGetVolunteerDomains = ({
  isEnabled = true,
}: {
  isEnabled: boolean;
}) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["volunteerDomainArray"],
    queryFn: async function fetchData() {
      const response: ApiResponseFormat = await axiosClient.get(
        "/event-volunteering-domain"
      );
      if (response.status === ResponseStatusType.Success) {
        dispatch(
          setEventDetails(
            response.result.map((e: any) => ({ label: e.name, value: e._id }))
          )
        );
        return response.result;
      }

      return null;
    },
  });
};
export const useGetEventTemplates = () => {
  return useQuery({
    queryKey: ["eventTemplates"],
    queryFn: async function fetchData() {
      const response: ApiResponseFormat = await axiosClient.get(
        "/event-templates"
      );
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }

      return null;
    },
  });
};

export const useCreateNewVolunteeringDomainMutation = () => {
  const { refetch } = useGetVolunteerDomains({ isEnabled: true });
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const response: ApiResponseFormat = await axiosClient.post(
        "/event-volunteering-domain",
        { name }
      );
      if (response.status === ResponseStatusType.Success) {
        return response.result;
      }
      throw new Error(response.result);
    },
    onSuccess: async (_, __) => {
      refetch();

      toast.success(`Domain created successfully! 🎉`);
    },

    onError: (error) => {
      console.error("Volunteering domain creation error:", error);
      toast.error(error.message ?? "Error");
    },
  });
};
