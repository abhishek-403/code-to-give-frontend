import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface FetchEventsParams {
  activeTab: string;
  searchQuery: string;
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
  searchQuery,
}: FetchEventsParams) => {
  const fetchPrograms = async ({
    pageParam = 1,
  }): Promise<ProgramsResponse> => {
    const res: ApiResponseFormat = await axiosClient.get(
      `/event?page=${pageParam}&limit=6`
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

  return useInfiniteQuery({
    queryKey: ["activeEvents", activeTab, searchQuery],
    queryFn: fetchPrograms,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};
