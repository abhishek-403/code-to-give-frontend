import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApplicationStatus,
  Availabitity,
  UserRole,
} from "@/lib/constants/server-constants";
import { auth } from "@/lib/firebaseConfig";
import { useGetVolunteerDomains, useInfiniteEvents } from "@/services/event";
import {
  useGetMyApplications,
  useGetVolunteerHistoryEvents,
} from "@/services/user";
import { formatDateFromDate } from "@/utils/formattedDate";
import Loader from "@/utils/loader";
import { Info, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation } from "react-router-dom"; // Import useLocation

import HistoryEventCard from "@/components/HistoryEventCard";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router-dom";

import useLanguage from "@/lib/hooks/useLang";
import { useAppSelector } from "@/store";

import EventCalendarComponent from "@/components/EventCalendarComponent";

interface EventType {
  _id: string;
  name: string;
  volunteeringDomains: any[];
  dateRange: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location: string;
  availability: [Availabitity];
}
interface MyApplicationType {
  _id: string;
  applicantEmail: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  eventId: { _id: string; name: string; description: string };
  availability: Availabitity;
  notes?: string;
  status: string;
  volunteeringDomain: any;
  willingEndDate: Date;
  willingStartDate: Date;
}
// interface HistoryEventType extends EventType {
//   // Additional fields specific to history events if needed
//   feedbackSubmitted?: boolean;
// }

interface FilterParams {
  city?: string;
  domain?: string;
  availability?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

const customStyles = `
  .focus-visible-ring:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
    border-radius: 0.25rem;
  }
  
  .apply-button:focus-visible {
    outline: 3px solid #3182ce;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
  
  .tabs-list {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .tab-trigger {
    padding: 0.75rem 1.5rem;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tab-trigger[aria-selected="true"] {
    border-bottom-color: #2563eb;
    color: #2563eb;
    font-weight: 500;
  }
  
  .tab-trigger:hover {
    background-color: #f1f5f9;
    color:rgb(0, 0, 0);
  }
  
  .tab-trigger:focus {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }
  
  :focus {
    outline: 3px solid #2563eb !important;
    outline-offset: 2px;
  }
  
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #2563eb;
    color: white;
    padding: 8px;
    z-index: 100;
    transition: top 0.3s;
  }
  
  .skip-link:focus {
    top: 0;
  }
  
  button:focus, 
  a:focus, 
  input:focus, 
  select:focus {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }
  
  .text-gray-500 {
    color: #64748b !important;
  }
  
  .dark .text-gray-500 {
    color: #94a3b8 !important;
  }
`;
type TABS = "active" | "history" | "myApplications";
const HomePage = () => {
  const [city, setCity] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  // const { data: volunteerArray } = useGetVolunteerDomains({ isEnabled: true });

  // const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);

  const [activeTab, setActiveTab] = useState("active");

  const location = useLocation(); // Access navigation state
  useEffect(() => {
    // Check if navigation state contains an activeTab value
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const [user, loading] = useAuthState(auth);
  const u = useAppSelector((a) => a.user);
  const navigate = useNavigate();
  const tabRefs = {
    active: useRef<HTMLButtonElement>(null),
    myApplications: useRef<HTMLButtonElement>(null),
    history: useRef<HTMLButtonElement>(null),
  };
  const {
    data: myApplicationData,
    isLoading: applicationLoading,
    isError: isApplicationError,
  } = useGetMyApplications({
    isEnabled: activeTab === "myApplications",
  });

  const filterParams = React.useMemo<FilterParams>(() => {
    if (!isFiltersApplied) {
      // Only include the search query if filters are not applied
      return {
        searchQuery: debouncedSearchQuery || undefined,
      };
    }

    return {
      city: city && city !== "all_cities" ? city : undefined,
      domain: domain && domain !== "all_domains" ? domain : undefined,
      availability:
        availability && availability !== "all_availability"
          ? availability
          : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      searchQuery: debouncedSearchQuery || undefined,
    };
  }, [
    isFiltersApplied,
    city,
    domain,
    availability,
    startDate,
    endDate,
    debouncedSearchQuery,
  ]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useInfiniteEvents({
    activeTab,
    ...filterParams,
  });

  useEffect(() => {
    refetch();
  }, [user]);
  const { ref: loadMoreRef, inView } = useInView();

  const events = data?.pages.flatMap((page) => page.events) || [];
  const { t } = useLanguage();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  const { data: volDomains } = useGetVolunteerDomains();

  useEffect(() => {
    // Only trigger refetch if the debounced value has changed
    refetch();
  }, [debouncedSearchQuery, refetch]);

  const clearAllFilters = () => {
    setCity("");
    setDomain("");
    setAvailability("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setIsFiltersApplied(false);
    // Refetch with cleared filters
    refetch();
  };

  const handleApplyFilters = () => {
    setIsFiltersApplied(true);
    // Refetch with applied filters
    refetch();
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, tabId: TABS) => {
    const tabs: TABS[] = ["active", "myApplications", "history"];
    const currentIndex = tabs.indexOf(tabId);

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) {
          const prevTab = tabs[currentIndex - 1];
          setActiveTab(prevTab);
          tabRefs[prevTab as keyof typeof tabRefs].current?.focus();
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < tabs.length - 1) {
          const nextTab = tabs[currentIndex + 1];
          setActiveTab(nextTab);
          tabRefs[nextTab as keyof typeof tabRefs].current?.focus();
        }
        break;
      case "Home":
        e.preventDefault();
        setActiveTab("active");
        tabRefs.active.current?.focus();
        break;
      case "End":
        e.preventDefault();
        setActiveTab("history");
        tabRefs.history.current?.focus();
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        setActiveTab(tabId);
        break;
    }
  };

  const EventCard = ({ ev }: { ev: EventType }) => {
    // ev = {
    //   ...ev,
    //   startDate:new Date(ev.startDate),
    //   endDate:new Date(ev.endDate);
    // }
    return (
      <Card className="w-full flex flex-col justify-between shadow-md transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between mb-2 items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{ev.name}</CardTitle>
              <CardDescription className="text-sm flex gap-1 flex-wrap text-gray-700 dark:text-gray-300 mt-2">
                <Badge
                  variant="outline"
                  className=" border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {ev.volunteeringDomains[0].name}
                </Badge>
                {ev.location && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {ev.location}
                  </Badge>
                )}
                {ev.availability && (
                  <Badge
                    variant="outline"
                    className=" bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-600"
                  >
                    {ev.availability[0]}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          {ev.description && (
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {ev.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3 ">
            <p className="text-sm font-medium">
              <span
                className="text-gray-700 dark:text-gray-300"
                aria-hidden="true"
              >
                {t("_")}{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {formatDateFromDate(ev.startDate)} {t("to")}{" "}
                {formatDateFromDate(ev.endDate)}
              </span>
            </p>

            <div className="flex gap-2 w-full">
              <Link to="/participant/register" className="w-1/2">
                <Button
                  className="w-full apply-button focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  variant="outline"
                  size="sm"
                >
                  {t("participant")}
                </Button>
              </Link>
              <Link to="/spectator/register" className="w-1/2">
                <Button
                  className="w-full apply-button focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  variant="outline"
                  size="sm"
                >
                  {t("spectator")}
                </Button>
              </Link>
            </div>

            {!user ? (
              <Button
                className="w-full apply-button focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  dark:focus:ring-blue-400"
                aria-label={`Apply to volunteer with ${ev.name}`}
                tabIndex={0}
                onClick={() => navigate("/login")}
              >
                {isLoading ? <Loader /> : "Login To apply"}
              </Button>
            ) : (
              <Link
                to={`/volunteer/register/${ev._id}`}
                className="w-full flex mt-auto justify-center"
                state={{ eventData: ev }}
              >
                <Button
                  className="w-full apply-button focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  dark:focus:ring-blue-400"
                  aria-label={`Apply to volunteer with ${ev.name}`}
                  tabIndex={0}
                >
                  {t("apply_now")}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  const MyApplicationCard = ({
    application,
  }: {
    application: MyApplicationType;
  }) => {
    return (
      <Card className="w-full flex flex-col justify-between shadow-md transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex w-full justify-between mb-2 items-start">
            <div className="w-full">
              <div className="flex  w-full">
                <CardTitle className="text-lg  font-semibold ">
                  {application.eventId.name}
                </CardTitle>
                {application.status === ApplicationStatus.APPROVED && (
                  <Badge className=" ml-auto text-[10px] h-fit hover:bg-green-500 bg-green-600">
                    {t("approved")}
                  </Badge>
                )}
              </div>

              <CardDescription className="text-sm flex gap-1 flex-wrap text-gray-700 dark:text-gray-300 mt-2">
                <Badge
                  variant="outline"
                  className=" border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {application.volunteeringDomain.name}
                </Badge>

                {application.availability && (
                  <Badge
                    variant="outline"
                    className=" bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-600"
                  >
                    {application.availability}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>

          <p className="text-sm text-gray-800 dark:text-gray-200">
            {application.eventId.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 ">
            <p className="text-sm font-medium">
              <span
                className="text-gray-700 dark:text-gray-300"
                aria-hidden="true"
              >
                {t("_")}{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {formatDateFromDate(application.willingEndDate)} {t("to")}{" "}
                {formatDateFromDate(application.willingEndDate)}
              </span>
            </p>
            {application.status === ApplicationStatus.APPROVED ? (
              <Link
                to={`/volunteer/event/${application.eventId?._id}`}
                state={{ applicationData: application }}
              >
                <Button className="w-full mt-2">{t("view_tasks")}</Button>
              </Link>
            ) : (
              <div>
                <Button variant={"outline"} className="w-full mt-2">
                  {t("approval_pending")}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const { data: historyEvents, isLoading: isHistoryLoading } =
    useGetVolunteerHistoryEvents({ isEnabled: activeTab === "history" });

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <style>{customStyles}</style>
      {/* Main content link for keyboard nav */}
      <a href="#main-content" className="skip-link">
        {t("skip_to_main_content")}
      </a>
      {/*Filters */}
      <div className="hidden md:block self-start top-[10px] z-10">
        <Card className="shadow-md h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("Find_Events")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Label htmlFor="searchInput" className="sr-only">
                {t("search_for_an_event")}
              </Label>
              <Search
                className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <Input
                id="searchInput"
                placeholder="Search for an event..."
                className="pl-8 w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for volunteering events"
              />
            </div>

            <div className="space-y-4">
              {/* Filter controls - keep them the same */}
              {/* City filter */}
              <div className="space-y-2">
                <Label
                  htmlFor="city-select"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  {t("city")}
                </Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger
                    id="city-select"
                    aria-label="Select city"
                    className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_cities">
                      {t("all_cities")}
                    </SelectItem>
                    <SelectItem value="Delhi">{t("delhi")}</SelectItem>
                    <SelectItem value="Mumbai">{t("mumbai")}</SelectItem>
                    <SelectItem value="Bangalore">{t("bangalore")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Domain filter */}
              <div className="space-y-2">
                <Label
                  htmlFor="domain-select"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  {/* {t("volunteering_domain")} */}
                  {t("Volunteering_Domain")}
                </Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger
                    id="domain-select"
                    aria-label="Select volunteering domain"
                    className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {volDomains &&
                      volDomains.map((domain: any) => (
                        <SelectItem value={domain.value}>
                          {domain.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                  {/* <SelectContent>
                    <SelectItem value="Rehabilitation">
                      {t("rehabilitation")}
                    </SelectItem>
                    <SelectItem value="Education">{t("education")}</SelectItem>
                    <SelectItem value="Community Support">
                      {t("community_support")}
                    </SelectItem>
                  </SelectContent> */}
                </Select>
              </div>

              {/* Availability filter */}
              <div className="space-y-2">
                <Label
                  htmlFor="availability-select"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  {t("availability")}
                </Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger
                    id="availability-select"
                    aria-label="Select availability"
                    className="focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="all_availability">
                      {t("any_availability")}
                    </SelectItem> */}
                    <SelectItem value={Availabitity.BOTH}>
                      {t("both_weekdays_weekends")}
                    </SelectItem>
                    <SelectItem value={Availabitity.WEEKDAYS}>
                      {t("weekdays")}
                    </SelectItem>
                    <SelectItem value={Availabitity.WEEKENDS}>
                      {t("weekends")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date filter */}
              <div className="space-y-2">
                <Label
                  htmlFor="start-date"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  {t("start_date")}
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  className="w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-label="Select start date"
                />
              </div>

              {/* End Date filter */}
              <div className="space-y-2">
                <Label
                  htmlFor="end-date"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  {t("end_date")}
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  className="w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="Select end date"
                />
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  variant="default"
                  className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  // onClick={() => {
                  //   if (
                  //     !city &&
                  //     !domain &&
                  //     !availability &&
                  //     !startDate &&
                  //     !endDate &&
                  //     !searchQuery
                  //   ) {
                  //     setFilteredEvents(events);
                  //   }
                  // }}
                  onClick={handleApplyFilters}
                  aria-label="Apply filters"
                >
                  {t("apply_filters")}
                </Button>

                <Button
                  variant="outline"
                  className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  onClick={clearAllFilters}
                  aria-label="Clear all filters"
                >
                  {t("clear_all")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/*filter badges */}
        {(city ||
          domain ||
          availability ||
          startDate ||
          endDate ||
          searchQuery) && (
          <Card className="mt-4 shadow-sm">
            <CardContent className="py-3">
              <p className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                {t("active_filters_")}
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Here the filter badges will be rendered - same as original code */}
                {/* Search query badge */}
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {t("search_")}
                    {searchQuery}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => setSearchQuery("")}
                      aria-label={`Clear search filter: ${searchQuery}`}
                    >
                      {t("_")}
                    </button>
                  </Badge>
                )}

                {/* City badge */}
                {city && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {t("city_")}
                    {city === "all_cities" ? "All Cities" : city}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => {
                        setCity("");
                        if (isFiltersApplied) {
                          setIsFiltersApplied(true);
                          refetch();
                        }
                      }}
                      aria-label={`Clear city filter: ${
                        city === "all_cities" ? "All Cities" : city
                      }`}
                    >
                      {t("_")}
                    </button>
                  </Badge>
                )}

                {/* Domain badge */}

                {/* Availability badge */}
                {availability && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {t("availability_")}{" "}
                    {availability === "all_availability"
                      ? "Any Availability"
                      : availability}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => {
                        setAvailability("");
                        if (isFiltersApplied) {
                          setIsFiltersApplied(true);
                          refetch();
                        }
                      }}
                      aria-label={`Clear availability filter: ${
                        availability === "all_availability"
                          ? "Any Availability"
                          : availability
                      }`}
                    >
                      {t("_")}
                    </button>
                  </Badge>
                )}

                {/* Date range badge */}
                {(startDate || endDate) && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {t("date_range")}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                        if (isFiltersApplied) {
                          setIsFiltersApplied(true);
                          refetch();
                        }
                      }}
                      aria-label="Clear date range filter"
                    >
                      {t("_")}
                    </button>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div id="main-content">
        <div className="w-full">
          <div
            role="tablist"
            aria-label="Event categories"
            className="flex border-b border-gray-200 dark:border-gray-700 mb-6"
          >
            <button
              ref={tabRefs.active}
              role="tab"
              id="active-tab-trigger"
              aria-controls="active-tab"
              aria-selected={activeTab === "active"}
              className={`tab-trigger ${
                activeTab === "active"
                  ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("active")}
              onKeyDown={(e) => handleTabKeyDown(e, "active")}
              tabIndex={0}
            >
              {t("active")}
            </button>
            {user && (
              <button
                ref={tabRefs.myApplications}
                role="tab"
                id="myApplications-tab-trigger"
                aria-controls="myApplications-tab"
                aria-selected={activeTab === "myApplications"}
                className={`tab-trigger ${
                  activeTab === "myApplications"
                    ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => {
                  setActiveTab("myApplications");
                }}
                onKeyDown={(e) => handleTabKeyDown(e, "myApplications")}
                tabIndex={0}
              >
                {t("my_applications")}
              </button>
            )}
            {user && (
              <button
                ref={tabRefs.history}
                role="tab"
                id="history-tab-trigger"
                aria-controls="history-tab"
                aria-selected={activeTab === "history"}
                className={`tab-trigger ${
                  activeTab === "history"
                    ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => setActiveTab("history")}
                onKeyDown={(e) => handleTabKeyDown(e, "history")}
                tabIndex={0}
              >
                {t("history")}
              </button>
            )}
          </div>

          <div
            role="tabpanel"
            id="active-tab"
            aria-labelledby="active-tab-trigger"
            hidden={activeTab !== "active"}
            tabIndex={0}
            className=" overflow-auto"
          >
            {activeTab === "active" &&
              (isLoading || isFetching || loading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : isError ? (
                <p className="text-red-400">
                  {t("error_loading_programs_please_try_again_")}
                </p>
              ) : events.length > 0 ? (
                <>
                  <div className="mb-4 w-full flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      {t("showing")} {events.length}{" "}
                      {events.length === 1 ? "event" : "events"}
                    </div>
                    <div>
                      {u && u.role === UserRole.ADMIN ? (
                        <Button
                          variant={"default"}
                          onClick={() => navigate("/admin")}
                          className="ml-auto"
                        >
                          Edit as Admin
                        </Button>
                      ) : (
                        u &&
                        u.role === UserRole.WEBMASTER && (
                          <Button
                            variant={"default"}
                            onClick={() => navigate("/admin")}
                            className="ml-auto"
                          >
                            Edit as webmaster
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                  <div className=" grid grid-cols-1 md:grid-cols-2 overflow-y-auto lg:grid-cols-3 gap-6">
                    {events.map((eachEvent: EventType) => (
                      <EventCard key={eachEvent._id} ev={eachEvent} />
                    ))}
                  </div>
                  <div ref={loadMoreRef} className="py-4 flex justify-center">
                    {isFetchingNextPage ? (
                      <Loader />
                    ) : (
                      hasNextPage && (
                        <span className="text-customNeutral-40 dark:text-contrast-30">
                          <Loader />
                        </span>
                      )
                    )}
                  </div>
                </>
              ) : (
                <div
                  className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  role="alert"
                >
                  <Info
                    className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    {t("no_events_found_matching_your_criteria_")}
                  </p>
                  <Button
                    variant="link"
                    onClick={clearAllFilters}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 rounded-md"
                  >
                    {t("clear_filters_and_try_again")}
                  </Button>
                </div>
              ))}
            {activeTab === "active" && events.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  {t("recommended_events")}
                </h2>

                {/* Use the correct user structure to find matches */}
                {events.filter((event) =>
                  // Check if user has volunteeringInterests
                  (u as any)?.volunteeringInterests?.some(
                    (interestId: string) =>
                      // Check if any event domain matches the user's interests by ID
                      event.volunteeringDomains.some(
                        (domain) =>
                          // If domain has an _id property, compare directly
                          (domain._id &&
                            domain._id.toString() === interestId) ||
                          // If domain is an object with id or value property
                          (domain.id && domain.id.toString() === interestId) ||
                          (domain.value &&
                            domain.value.toString() === interestId)
                      )
                  )
                ).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto lg:grid-cols-3 gap-6">
                    {events
                      .filter((event) =>
                        (u as any)?.volunteeringInterests?.some(
                          (interestId: string) =>
                            event.volunteeringDomains.some(
                              (domain) =>
                                (domain._id &&
                                  domain._id.toString() === interestId) ||
                                (domain.id &&
                                  domain.id.toString() === interestId) ||
                                (domain.value &&
                                  domain.value.toString() === interestId)
                            )
                        )
                      )
                      .map((eachEvent: EventType) => (
                        <EventCard
                          key={`recommended-${eachEvent._id}`}
                          ev={eachEvent}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Info
                      className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {t("no_recommended_events_found")}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/profile")}
                      className="focus:ring-2 focus:ring-blue-500"
                    >
                      {t("update_interests")}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "active" && events.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  {t("event_calendar")}
                </h2>
                <EventCalendarComponent events={events} />
              </div>
            )}
          </div>

          <div
            role="tabpanel"
            id="myApplications-tab"
            aria-labelledby="myApplications-tab-trigger"
            hidden={activeTab !== "myApplications"}
            tabIndex={0}
          >
            {activeTab === "myApplications" &&
              (applicationLoading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : isApplicationError ? (
                <p className="text-red-400">
                  {t("error_loading_programs_please_try_again_")}
                </p>
              ) : myApplicationData.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    {t("showing")} {myApplicationData.length}{" "}
                    {myApplicationData.length === 1
                      ? "application"
                      : "applications"}
                  </div>
                  <div className=" grid grid-cols-1 md:grid-cols-2 overflow-y-auto lg:grid-cols-3 gap-6">
                    {myApplicationData.map((application: MyApplicationType) => (
                      <MyApplicationCard
                        key={application._id}
                        application={application}
                      />
                    ))}
                  </div>
                  {/* <div ref={loadMoreRef} className="py-4 flex justify-center">
                    {isFetchingNextPage ? (
                      <Loader />
                    ) : (
                      hasNextPage && (
                        <span className="text-customNeutral-40 dark:text-contrast-30">
                          <Loader />
                        </span>
                      )
                    )}
                  </div> */}
                </>
              ) : (
                <div
                  className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  role="alert"
                >
                  <Info
                    className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    {t("no_applications_found_")}
                  </p>
                  <Button
                    variant="link"
                    onClick={clearAllFilters}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 rounded-md"
                  >
                    {t("clear_filters_and_try_again")}
                  </Button>
                </div>
              ))}
          </div>

          <div
            role="tabpanel"
            id="history-tab"
            aria-labelledby="history-tab-trigger"
            hidden={activeTab !== "history"}
            tabIndex={0}
          >
            {activeTab === "history" &&
              (isHistoryLoading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : isError ? (
                <p className="text-red-400">
                  {t("error_loading_programs_please_try_again_")}
                </p>
              ) : historyEvents && historyEvents.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    {" "}
                    {t("showing")} {historyEvents.length}{" "}
                    {historyEvents.length === 1 ? "event" : "events"}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {historyEvents.map((eachEvent: any, i: number) => (
                      <div>
                        <HistoryEventCard
                          event={eachEvent}
                          key={i}
                          // className="w-full flex flex-col justify-between shadow-md transition-all hover:shadow-lg"
                        />
                        {/* <CardHeader>
                            <div className="flex justify-between mb-2 items-start">
                              <div className="w-full">
                                <div className="flex w-full items-center">
                                  <CardTitle className="text-lg font-semibold flex-grow">
                                    {eachEvent.name}
                                  </CardTitle>
                                  {eachEvent.feedbackSubmitted && (
                                    <Badge
                                      variant="default"
                                      className="ml-2 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-full inline-flex items-center justify-center text-center"
                                    >
                                      Feedback Done
                                    </Badge>
                                  )}
                                </div>
                                <CardDescription className="text-sm flex gap-1 flex-wrap text-gray-700 dark:text-gray-300 mt-2">
                                  <Badge
                                    variant="outline"
                                    className="border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                  >
                                    {eachEvent.volunteeringDomains[0].name}
                                  </Badge>
                                  {eachEvent.location && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    >
                                      {eachEvent.location}
                                    </Badge>
                                  )}
                                  {eachEvent.availability && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-600"
                                    >
                                      {eachEvent.availability[0]}
                                    </Badge>
                                  )}
                                </CardDescription>
                              </div>
                            </div>
                            {eachEvent.description && (
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                {eachEvent.description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 ">
                              <p className="text-sm font-medium">
                                <span
                                  className="text-gray-700 dark:text-gray-300"
                                  aria-hidden="true"
                                >
                                  📅{" "}
                                </span>
                                <span className="text-gray-800 dark:text-gray-200">
                                  {formatDateFromDate(eachEvent.startDate)} to{" "}
                                  {formatDateFromDate(eachEvent.endDate)}
                                </span>
                              </p>
                              {eachEvent.feedbackSubmitted ? (
                                <Button
                                  className="w-full apply-button focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  dark:focus:ring-blue-400"
                                  aria-label={`View feedback for ${eachEvent.name}`}
                                  tabIndex={0}
                                >
                                  View Feedback
                                </Button>
                              ) : (
                                <Button
                                  className="w-full apply-button focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  dark:focus:ring-blue-400"
                                  aria-label={`Submit feedback for ${eachEvent.name}`}
                                  tabIndex={0}
                                >
                                  Submit Feedback
                                </Button>
                              )}
                            </div>
                          </CardContent> */}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  role="alert"
                >
                  <Info
                    className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    {t("no_events_found_matching_your_criteria_")}
                  </p>
                  <Button
                    variant="link"
                    onClick={clearAllFilters}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 rounded-md"
                  >
                    {t("clear_filters_and_try_again")}
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
