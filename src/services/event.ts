import { axiosClient } from "@/lib/axiosConfig";
import {
  ApiResponseFormat,
  ResponseStatusType,
} from "@/lib/constants/response-types";
import { useInfiniteQuery } from "@tanstack/react-query";

// implementation in HomePage.tsx:
/* 
const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteEvents({
    activeTab,
    ...filterParams,
  });

  where filterParams:

  const filterParams = React.useMemo<FilterParams>(() => {
      if (!isFiltersApplied) {
        // Only include the search query if filters are not applied
        return {
          searchQuery: debouncedSearchQuery || undefined
        };
      }
      
      return {
        city: city && city !== "all_cities" ? city : undefined,
        domain: domain && domain !== "all_domains" ? domain : undefined,
        availability: availability && availability !== "all_availability" ? availability : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        searchQuery: debouncedSearchQuery || undefined
      };
    }, [isFiltersApplied, city, domain, availability, startDate, endDate, debouncedSearchQuery]);
*/
// adjust according to above implementation

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
