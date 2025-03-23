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
import { Availabitity } from "@/lib/constants/server-constants";
import { useInfiniteEvents } from "@/services/event";
import { formatDateFromDate } from "@/utils/formattedDate";
import Loader from "@/utils/loader";
import { Info, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
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

const HomePage = () => {
  const [city, setCity] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);

  const [activeTab, setActiveTab] = useState("active");

  const tabRefs = {
    active: useRef<HTMLButtonElement>(null),
    underReview: useRef<HTMLButtonElement>(null),
    history: useRef<HTMLButtonElement>(null),
  };

  // const events = React.useMemo<EventType[]>(
  //   () => [
  //     {
  //       id: 1,
  //       organization: "XYZ Event",
  //       domain: "Rehabilitation",
  //       dateRange: "20/02/25 to 20/03/25",
  //       startDate: new Date(2025, 1, 20),
  //       endDate: new Date(2025, 2, 20),
  //       description:
  //         "Help with rehabilitation activities for people with disabilities",
  //       location: "Delhi",
  //       availability: "Weekdays",
  //     },
  //     {
  //       id: 2,
  //       organization: "ABC Event",
  //       domain: "Community Support",
  //       dateRange: "15/03/25 to 30/03/25",
  //       startDate: new Date(2025, 2, 15),
  //       endDate: new Date(2025, 2, 30),
  //       description:
  //         "Provide community support services to underprivileged families",
  //       location: "Mumbai",
  //       availability: "Both",
  //     },
  //     {
  //       id: 3,
  //       organization: "PQR Event",
  //       domain: "Education",
  //       dateRange: "01/04/25 to 15/04/25",
  //       startDate: new Date(2025, 3, 1),
  //       endDate: new Date(2025, 3, 15),
  //       description: "Teach basic skills to children with special needs",
  //       location: "Bangalore",
  //       availability: "Weekends",
  //     },
  //   ],
  //   []
  // );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    // refetch,
  } = useInfiniteEvents({
    activeTab,
    searchQuery,
  });
  const { ref: loadMoreRef, inView } = useInView();

  const events = data?.pages.flatMap((page) => page.events) || [];
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  // const parseDate = (dateString: string): Date | null => {
  //   if (!dateString) return null;
  //   return new Date(dateString);
  // };

  // useEffect(() => {
  //   const filtered = events.filter((event) => {
  //     const matchesSearch =
  //       !searchQuery ||
  //       event.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       event.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       (event.description &&
  //         event.description.toLowerCase().includes(searchQuery.toLowerCase()));

  //     const matchesCity =
  //       !city ||
  //       city === "" ||
  //       city === "all_cities" ||
  //       event.location === city;

  //     const matchesDomain =
  //       !domain ||
  //       domain === "" ||
  //       domain === "all_domains" ||
  //       event.domain === domain;

  //     const matchesAvailability =
  //       !availability ||
  //       availability === "" ||
  //       availability === "all_availability" ||
  //       event.availability === availability ||
  //       (event.availability === "Both" && availability !== "");

  //     let matchesDate = true;
  //     const filterStartDate = parseDate(startDate);
  //     const filterEndDate = parseDate(endDate);

  //     if (filterStartDate) {
  //       matchesDate = matchesDate && event.endDate >= filterStartDate;
  //     }

  //     if (filterEndDate) {
  //       matchesDate = matchesDate && event.startDate <= filterEndDate;
  //     }

  //     return (
  //       matchesSearch &&
  //       matchesCity &&
  //       matchesDomain &&
  //       matchesAvailability &&
  //       matchesDate
  //     );
  //   });

  //   setFilteredEvents(filtered);
  // }, [searchQuery, city, domain, availability, startDate, endDate, events]);

  // useEffect(() => {
  //   setFilteredEvents(events);
  // }, [events]);

  const clearAllFilters = () => {
    setCity("");
    setDomain("");
    setAvailability("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const tabs = ["active", "underReview", "history"];
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
                    {ev.availability}
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
                📅{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {formatDateFromDate(ev.startDate)} to{" "}
                {formatDateFromDate(ev.endDate)}
              </span>
            </p>
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
                Apply Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <style>{customStyles}</style>

      {/* Main content link for keyboard nav */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/*Filters */}
      <div className="sticky  self-start top-[10px]">
        <Card className="shadow-md h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Find events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Label htmlFor="searchInput" className="sr-only">
                Search for an event
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
              <div className="space-y-2">
                <Label
                  htmlFor="city-select"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  City
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
                    <SelectItem value="all_cities">All Cities</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="domain-select"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Volunteering Domain
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
                    <SelectItem value="all_domains">All Domains</SelectItem>
                    <SelectItem value="Rehabilitation">
                      Rehabilitation
                    </SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Community Support">
                      Community Support
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="availability-select"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Availability
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
                    <SelectItem value="all_availability">
                      Any Availability
                    </SelectItem>
                    <SelectItem value="Both">
                      Both Weekdays & Weekends
                    </SelectItem>
                    <SelectItem value="Weekdays">Weekdays Only</SelectItem>
                    <SelectItem value="Weekends">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="start-date"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Start Date
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

              <div className="space-y-2">
                <Label
                  htmlFor="end-date"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  End Date
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
                  aria-label="Apply filters"
                >
                  Apply Filters
                </Button>

                <Button
                  variant="outline"
                  className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  onClick={clearAllFilters}
                  aria-label="Clear all filters"
                >
                  Clear All
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
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Search: {searchQuery}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => setSearchQuery("")}
                      aria-label={`Clear search filter: ${searchQuery}`}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {city && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    City: {city === "all_cities" ? "All Cities" : city}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => setCity("")}
                      aria-label={`Clear city filter: ${
                        city === "all_cities" ? "All Cities" : city
                      }`}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {domain && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Domain: {domain === "all_domains" ? "All Domains" : domain}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => setDomain("")}
                      aria-label={`Clear domain filter: ${
                        domain === "all_domains" ? "All Domains" : domain
                      }`}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {availability && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Availability:{" "}
                    {availability === "all_availability"
                      ? "Any Availability"
                      : availability}
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => setAvailability("")}
                      aria-label={`Clear availability filter: ${
                        availability === "all_availability"
                          ? "Any Availability"
                          : availability
                      }`}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {(startDate || endDate) && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Date Range
                    <button
                      className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      aria-label="Clear date range filter"
                    >
                      ✕
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
              Active
            </button>
            <button
              ref={tabRefs.underReview}
              role="tab"
              id="underReview-tab-trigger"
              aria-controls="underReview-tab"
              aria-selected={activeTab === "underReview"}
              className={`tab-trigger ${
                activeTab === "underReview"
                  ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("underReview")}
              onKeyDown={(e) => handleTabKeyDown(e, "underReview")}
              tabIndex={0}
            >
              Under Review
            </button>
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
              History
            </button>
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
              (isLoading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : isError ? (
                <p className="text-red-400">
                  Error loading programs. Please try again.
                </p>
              ) : events.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    Showing {events.length}{" "}
                    {events.length === 1 ? "event" : "events"}
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
                    No events found matching your criteria.
                  </p>
                  <Button
                    variant="link"
                    onClick={clearAllFilters}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 rounded-md"
                  >
                    Clear filters and try again
                  </Button>
                </div>
              ))}
          </div>

          <div
            role="tabpanel"
            id="underReview-tab"
            aria-labelledby="underReview-tab-trigger"
            hidden={activeTab !== "underReview"}
            tabIndex={0}
          >
            {activeTab === "underReview" && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  You have no applications under review.
                </p>
              </div>
            )}
          </div>

          <div
            role="tabpanel"
            id="history-tab"
            aria-labelledby="history-tab-trigger"
            hidden={activeTab !== "history"}
            tabIndex={0}
          >
            {activeTab === "history" && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Your volunteer history will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
