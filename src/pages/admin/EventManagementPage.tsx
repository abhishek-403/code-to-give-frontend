import ApplicationCard from "@/components/ApplicationDetailsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EventStatus, TaskStatus } from "@/lib/constants/server-constants";
import useLanguage from "@/lib/hooks/useLang";
import {
  useAddTaskToEventMutation,
  useEditEventMutation,
  useInfiniteEventsForAdmin,
} from "@/services/event";
import { RootState, useAppSelector } from "@/store";
import { Task } from "@/types/event";
import Loader from "@/utils/loader";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Mail,
  MessageCircle,
  PlusCircle,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

export interface AdminEventsDataType {
  _id: string;
  name: string;
  description: string;
  status: EventStatus;
  endData: Date;
  startDate: Date;
  location: string;
  applications: any[];
  volunteeers: any[];
}

const EventEditDialog = ({
  event,
  isOpen,
  onOpenChange,
  onSave,
}: {
  event: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedDetails: any) => void;
}) => {
  const { t } = useLanguage();
  const [editedEvent, setEditedEvent] = useState({
    title: event?.name || "", // Use empty string as fallback
    description: event?.description || "",
    startDate: event?.startDate ? new Date(event.startDate) : new Date(),
    endDate: event?.endDate ? new Date(event.endDate) : new Date(),
    location: event?.location || "",
    status: event?.status || EventStatus.ACTIVE,
  });

  useEffect(() => {
    if (isOpen && event) {
      setEditedEvent({
        title: event.name || "",
        description: event.description || "",
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate ? new Date(event.endDate) : new Date(),
        location: event.location || "",
        status: event.status || EventStatus.ACTIVE,
      });
    }
  }, [isOpen, event]);
  const { mutate } = useEditEventMutation();

  const handleSave = async () => {
    // try {
    //   await updateEvent(event._id, editedEvent);
    //   onOpenChange(false); // Close dialog on successful update
    //   // Optionally, you can add a toast or snackbar notification
    // } catch (error) {
    //   // Handle error (show error message to user)
    //   console.error("Failed to update event", error);
    // }
    mutate({
      eventId: event._id,
      eventData: {
        name: editedEvent.title,
        description: editedEvent.description,
        startDate: new Date(editedEvent.startDate),
        endDate: new Date(editedEvent.endDate),
        location: editedEvent.location,
        status: editedEvent.status,
      },
    });
    onSave({
      name: editedEvent.title,
      description: editedEvent.description,
      startDate: editedEvent.startDate,
      endDate: editedEvent.endDate,
      location: editedEvent.location,
      status: event.status || EventStatus.ACTIVE,
    });
    onOpenChange(false);
  };
  const [open, setOpen] = useState(false);

  const handleSelect = (status: EventStatus) => {
    setEditedEvent((prev) => ({ ...prev, status }));
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t("edit_event_details")}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[500px] pr-16 pt-5 pb-5">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                {t("event_title")}
              </Label>
              <Input
                id="title"
                value={editedEvent.title}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, title: e.target.value })
                }
                className="col-span-3 text-neutral-900"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("description")}
              </Label>
              <Textarea
                id="description"
                value={editedEvent.description}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("status")}
              </Label>
              <div className="relative">
                <Button variant="outline" onClick={() => setOpen(!open)}>
                  {editedEvent.status
                    ? editedEvent.status
                    : "Select Event Status"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                {open && (
                  <Command className="absolute z-50 h-[140px] bg-white dark:bg-black w-[300px] rounded-md border bg-popover text-popover-foreground shadow-md">
                    <CommandList>
                      <CommandEmpty>{t("no_status_found_")}</CommandEmpty>
                      <CommandGroup className="bg-white dark:bg-black">
                        {Object.values(EventStatus).map((status) => (
                          <CommandItem
                            key={status}
                            value={status}
                            onSelect={() => handleSelect(status as EventStatus)}
                          >
                            {status}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("start_date")}</Label>
              <Calendar
                mode="single"
                selected={editedEvent.startDate}
                onSelect={(date) =>
                  setEditedEvent({
                    ...editedEvent,
                    startDate: date || new Date(),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("end_date")}</Label>
              <Calendar
                mode="single"
                selected={editedEvent.endDate}
                onSelect={(date) =>
                  setEditedEvent({
                    ...editedEvent,
                    endDate: date || new Date(),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                {t("location")}
              </Label>
              <Input
                id="location"
                value={editedEvent.location}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, location: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" onClick={handleSave}>
            {t("save_changes")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EventManagementPage = () => {
  // Enhanced mock data for existing events - now with task completion status
  const [isHistoryView, setIsHistoryView] = useState(false);
  const [activeTab, setActiveTab] = useState<EventStatus>(EventStatus.ACTIVE);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    // refetch,
  } = useInfiniteEventsForAdmin({
    status: activeTab,
    // ...filterParams,
  });

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const events = data?.pages.flatMap((page) => page.events) || [];
  // const [activeTab, setActiveTab] = useState<any>("active");

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const handleSaveEventChanges = (updatedEventDetails: any) => {
    // Temporarily update the selectedEvent state
    setSelectedEvent((prevEvent: any) => ({
      ...prevEvent,
      ...updatedEventDetails,
      name: updatedEventDetails.title, // Explicitly update the name
    }));

    // Close the edit dialog
    setIsEditEventOpen(false);
  };

  const [taskFilter, setTaskFilter] = useState<any>("all");

  // const [newEvent, __] = useState<any>({
  //   title: "",
  //   description: "",
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   location: "",
  //   status: "underReview",
  // });

  // State for new task form
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<any>(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    completed: false,
  });

  const [isTaskAssignOpen, setIsTaskAssignOpen] = useState<any>(false);
  const [taskToAssign, setTaskToAssign] = useState<any>(null);

  // State for email update form
  const [isEmailOpen, setIsEmailOpen] = useState<any>(false);
  const [emailUpdate, setEmailUpdate] = useState<any>({
    subject: "",
    message: "",
  });
  const [isVolunteerEmailOpen, setIsVolunteerEmailOpen] = useState<any>(false);
  const [volunteerEmailData, setVolunteerEmailData] = useState<any>({
    volunteerId: null,
    volunteerName: "",
    volunteerEmail: "",
    subject: "",
    message: "",
  });

  // Add this near your other state declarations
  const [dummyCompletedEvents, ___] = useState([
    {
      _id: "completed-event-1",
      name: "Inclusive Job Drive with Barclays",
      description:
        "Samarthanam organized an inclusive job drive for young people in Bengaluru in partnership with Barclays. The event connected youth from diverse backgrounds with potential employers.",
      location: "Samarthanam Trust Centre, Bengaluru",
      startDate: new Date(2022, 8, 17), // September 17, 2022
      endDate: new Date(2022, 8, 17),
      status: EventStatus.COMPLETED,
      applications: [],
      tasks: [
        {
          _id: "c-task-1",
          name: "Candidate Registration",
          description: "Register participants and verify documentation",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c-task-2",
          name: "Employer Coordination",
          description: "Set up interview booths for employers",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c-task-3",
          name: "Accessibility Arrangements",
          description:
            "Ensure all facilities are accessible for disabled participants",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c-task-4",
          name: "Skills Workshop",
          description: "Conduct pre-interview skills workshop for candidates",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
      ],
      volunteers: [
        {
          _id: "c-vol-1",
          displayName: "Priya Sharma",
          email: "priya@example.com",
          assigned: true,
        },
        {
          _id: "c-vol-2",
          displayName: "Rajesh Kumar",
          email: "rajesh@example.com",
          assigned: true,
        },
        {
          _id: "c-vol-3",
          displayName: "Sneha Patel",
          email: "sneha@example.com",
          assigned: true,
        },
      ],
      feedbacks: [
        {
          _id: "feedback-1",
          title: "Life-Changing Opportunity",
          content:
            "This job drive helped me secure my first job. The accessibility arrangements were excellent!",
          rating: 5,
          user: { displayName: "Vikram Desai" },
          date: new Date(2022, 8, 18),
        },
        {
          _id: "feedback-2",
          title: "Well Organized",
          content:
            "The preparation workshop before interviews was very helpful. Would recommend more such events.",
          rating: 4,
          user: { displayName: "Meera Jayaraman" },
          date: new Date(2022, 8, 19),
        },
      ],
    },
    {
      _id: "completed-event-2",
      name: "Free Eye Check-up Camp with Shankara Eye Hospital",
      description:
        "Free eye check-up camp organized at Primary Health Center Varthur. 151 people were assessed and 74 received referrals for free eye surgery at Shankara Eye Hospital.",
      location: "Primary Health Center, Varthur",
      startDate: new Date(2021, 9, 29), // October 29, 2021
      endDate: new Date(2021, 9, 29),
      status: EventStatus.COMPLETED,
      applications: [],
      tasks: [
        {
          _id: "c2-task-1",
          name: "Patient Registration",
          description: "Register patients and collect basic health information",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c2-task-2",
          name: "Medical Support",
          description:
            "Assist medical staff with equipment and patient management",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c2-task-3",
          name: "Referral Coordination",
          description:
            "Coordinate surgery referrals with Shankara Eye Hospital",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
      ],
      volunteers: [
        {
          _id: "c2-vol-1",
          displayName: "Anand Venkatesh",
          email: "anand@example.com",
          assigned: true,
        },
        {
          _id: "c2-vol-2",
          displayName: "Lakshmi Narayanan",
          email: "lakshmi@example.com",
          assigned: true,
        },
      ],
      feedbacks: [
        {
          _id: "c2-feedback-1",
          title: "Essential Service",
          content:
            "My mother received free cataract surgery through this camp. Eternally grateful to Samarthanam and Shankara Hospital.",
          rating: 5,
          user: { displayName: "Ramesh Gowda" },
          date: new Date(2021, 9, 30),
        },
      ],
    },
    {
      _id: "completed-event-3",
      name: "Smart Classroom Inauguration with DXC Technology",
      description:
        "Smart Classroom inauguration at Government High School, Saneguruvanahalli. This DXC Technology-supported initiative aims to enhance education through digital tools.",
      location: "Government High School, Saneguruvanahalli, Bangalore",
      startDate: new Date(2022, 9, 9), // October 9, 2022
      endDate: new Date(2022, 9, 9),
      status: EventStatus.COMPLETED,
      applications: [],
      tasks: [
        {
          _id: "c3-task-1",
          name: "Equipment Setup",
          description: "Install and test digital classroom equipment",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c3-task-2",
          name: "Teacher Training",
          description: "Train teachers on using digital education tools",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c3-task-3",
          name: "Inauguration Ceremony",
          description: "Organize ceremony with dignitaries",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c3-task-4",
          name: "Media Coordination",
          description: "Coordinate with press and handle documentation",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
      ],
      volunteers: [
        {
          _id: "c3-vol-1",
          displayName: "Karthik Subramanian",
          email: "karthik@example.com",
          assigned: true,
        },
        {
          _id: "c3-vol-2",
          displayName: "Divya Mohan",
          email: "divya@example.com",
          assigned: true,
        },
        {
          _id: "c3-vol-3",
          displayName: "Prakash Rao",
          email: "prakash@example.com",
          assigned: true,
        },
      ],
      feedbacks: [
        {
          _id: "c3-feedback-1",
          title: "Transformative Initiative",
          content:
            "The smart classroom will make learning more accessible for students with disabilities. Proud to be associated with this project.",
          rating: 5,
          user: { displayName: "Principal, Govt High School" },
          date: new Date(2022, 9, 10),
        },
        {
          _id: "c3-feedback-2",
          title: "Excellent Implementation",
          content:
            "The technical setup was top-notch. Looking forward to seeing how it enhances learning for the students.",
          rating: 4,
          user: { displayName: "DXC Technology Representative" },
          date: new Date(2022, 9, 11),
        },
        {
          _id: "c3-feedback-3",
          title: "Needs More Training Sessions",
          content:
            "Great initiative but we would benefit from additional training sessions for teachers to fully utilize the technology.",
          rating: 3,
          user: { displayName: "Sanjay Patel, Teacher" },
          date: new Date(2022, 9, 12),
        },
      ],
    },
  ]);

  // load data from the backend integration when available
  // useEffect(() => {
  //   // fetch data here
  //   const fetchEvents = async () => {
  //     try {
  //       // const response = await fetch('/api/events');
  //       // const data = await response.json();
  //       // setEvents(ensureVolunteerTaskConsistency(data));
  //       // For now, using mock data:
  //       // setEvents((prevEvents) => ensureVolunteerTaskConsistency(prevEvents));
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []); // Run once on component mount

  // Calculate task completion percentage for an event
  const calculateTaskCompletion = (event: any) => {
    if (event.tasks.length === 0) return 0;
    const completedTasks = event.tasks.filter(
      (task: any) => task.status === TaskStatus.COMPLETED
    ).length;
    return Math.round((completedTasks / event.tasks.length) * 100);
  };

  // Enhanced task assignment handler to manage all task states
  // Replace the handleTaskAssignment function with this improved version
  const handleTaskAssignment = (newAssigneeId: any) => {
    if (!selectedEvent || !taskToAssign) return;

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        // Find if the volunteer is waitlisted
        const assigneeVolunteer = event.volunteers.find(
          (v: any) => v.id === parseInt(newAssigneeId)
        );

        // First update volunteer status if needed
        let updatedVolunteers = event.volunteers;
        if (
          newAssigneeId !== "none" &&
          assigneeVolunteer &&
          !assigneeVolunteer.assigned
        ) {
          // Auto-activate waitlisted volunteer when assigned a task
          updatedVolunteers = event.volunteers.map((volunteer: any) => {
            if (volunteer.id === parseInt(newAssigneeId)) {
              return { ...volunteer, assigned: true };
            }
            return volunteer;
          });
        }

        // Then update the task
        return {
          ...event,
          volunteers: updatedVolunteers,
          tasks: event.tasks.map((task: any) => {
            if (task.id === taskToAssign.id) {
              // Determine the new task state based on action type and current state
              const action = taskToAssign.actionType || "reassign";

              if (action === "complete") {
                // Mark as complete
                return { ...task, completed: true };
              } else if (action === "reopen") {
                // Reopen a completed task
                return { ...task, completed: false };
              } else if (action === "reassign") {
                // Handle reassignment
                return {
                  ...task,
                  assignedTo:
                    newAssigneeId === "none" ? null : parseInt(newAssigneeId),
                  // When reassigning, if it was completed, keep it completed
                  // If it was unassigned and now assigned, mark as pending
                  completed:
                    task.assignedTo === null && newAssigneeId !== "none"
                      ? false
                      : task.completed,
                };
              }
              return task;
            }
            return task;
          }),
        };
      }
      return event;
    });

    // setEvents(updatedEvents);
    if (selectedEvent) {
      setSelectedEvent(
        updatedEvents.find((event) => event.id === selectedEvent.id)
      );
    }

    setIsTaskAssignOpen(false);
    setTaskToAssign(null);
  };

  // New function to handle task completion directly
  // const handleMarkTaskComplete = (eventId: any, taskId: any) => {
  //   const updatedEvents = events.map((event) => {
  //     if (event.id === eventId) {
  //       return {
  //         ...event,
  //         tasks: event.tasks.map((task: any) => {
  //           if (task.id === taskId) {
  //             return { ...task, completed: true };
  //           }
  //           return task;
  //         }),
  //       };
  //     }
  //     return event;
  //   });

  //   // setEvents(updatedEvents);
  //   if (selectedEvent && selectedEvent.id === eventId) {
  //     setSelectedEvent(updatedEvents.find((event) => event.id === eventId));
  //   }
  // };

  // New function to reopen a completed task
  // New function to reopen a completed task
  // const handleReopenTask = (eventId: any, taskId: any) => {
  //   const updatedEvents = events.map((event) => {
  //     if (event.id === eventId) {
  //       return {
  //         ...event,
  //         tasks: event.tasks.map((task: any) => {
  //           if (task.id === taskId) {
  //             return { ...task, completed: false };
  //           }
  //           return task;
  //         }),
  //       };
  //     }
  //     return event;
  //   });

  //   // setEvents(updatedEvents);
  //   if (selectedEvent && selectedEvent.id === eventId) {
  //     setSelectedEvent(updatedEvents.find((event) => event.id === eventId));
  //   }
  // };

  // Calculate task statistics for the selected event
  const getTaskStats = (event: any) => {
    if (!event || !event.tasks)
      return { completed: 0, pending: 0, unassigned: 0, total: 0 };

    const completed = event.tasks.filter(
      (task: any) => task.status === TaskStatus.COMPLETED
    ).length;
    const unassigned = event.tasks.filter(
      (task: any) => task.assignedTo === null
    ).length;
    const pending = event.tasks.length - completed - unassigned;

    return {
      completed,
      pending,
      unassigned,
      total: event.tasks.length,
    };
  };

  // Filter tasks based on their status
  const getFilteredTasks = (event: any, filter: any) => {
    if (!event) return [];
    console.log(event);

    switch (filter) {
      case "completed":
        return event.tasks.filter(
          (task: any) => task.status === TaskStatus.COMPLETED
        );
      case "pending":
        return event.tasks.filter(
          (task: any) => task.status === TaskStatus.ASSIGNED
        );
      case "unassigned":
        return event.tasks.filter((task: any) => task.assignedTo === null);
      default:
        return event.tasks;
    }
  };

  const handleEdit = (id: any) => {
    // First check in the API events
    let eventToEdit = events.find((event) => event._id === id);

    // If not found and we're in the history tab, check in dummy completed events
    if (!eventToEdit && activeTab === EventStatus.COMPLETED) {
      eventToEdit = dummyCompletedEvents.find((event) => event._id === id);
    }

    if (eventToEdit) {
      console.log("Editing event:", eventToEdit);
      setSelectedEvent(eventToEdit);
      setIsHistoryView(eventToEdit.status === EventStatus.COMPLETED);
    }
  };

  const handleDelete = (_: any) => {
    // const updatedEvents = events.filter((event) => event.id !== id);
    // setEvents(updatedEvents);
  };

  // const handleAddEvent = async () => {
  //   const eventToAdd = {
  //     ...newEvent,
  //     id: events.length + 1, // In production, this ID would come from the server
  //     volunteers: [],
  //     tasks: [],
  //   };

  //   // In production, you would add API call here, for example:
  //   // const response = await fetch('/api/events', {
  //   //   method: 'POST',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify(eventToAdd)
  //   // });
  //   // const savedEvent = await response.json();
  //   // setEvents([...events, savedEvent]);

  //   // For now, using local state:
  //   // setEvents([...events, eventToAdd]);
  //   setIsAddEventOpen(false);
  //   // setNewEvent({
  //   //   title: "",
  //   //   description: "",
  //   //   startDate: new Date(),
  //   //   endDate: new Date(),
  //   //   location: "",
  //   //   status: "underReview",
  //   // });
  // };
  const userId = useAppSelector((u: RootState) => u.user._id);

  const { mutate: addTaskAPI, isPending } = useAddTaskToEventMutation();
  const handleAddTask = async () => {
    if (!selectedEvent) return;
    addTaskAPI({
      name: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedBy: userId || "",
      status: TaskStatus.ASSIGNED,
      eventId: selectedEvent._id,
    });

    // const newTaskData = {
    //   id: Date.now(), // In production, this ID would come from the server
    //   title: newTask.title,
    //   description: newTask.description,
    //   assignedTo:
    //     newTask.assignedTo === "none" ? null : parseInt(newTask.assignedTo),
    //   completed: newTask.completed,
    // };

    // In production, you would add API call here, for example:
    // const response = await fetch(`/api/events/${selectedEvent.id}/tasks`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newTaskData)
    // });
    // const savedTask = await response.json();

    // const updatedEvents = events.map((event) => {
    //   if (event.id === selectedEvent.id) {
    //     return {
    //       ...event,
    //       tasks: [...event.tasks, newTaskData],
    //     };
    //   }
    //   return event;
    // });

    // setEvents(updatedEvents);
    setIsAddTaskOpen(false);
    // setNewTask({
    //   title: "",
    //   description: "",
    //   assignedTo: "none",
    //   completed: false,
    // });

    // Update selected event
    // setSelectedEvent(
    //   updatedEvents.find((event) => event.id === selectedEvent.id)
    // );
  };

  // Replace the handleAssignVolunteer function with this version
  const handleAssignVolunteer = (eventId: any, volunteerId: any) => {
    const event = events.find((e) => e.id === eventId);
    const volunteer = event?.volunteers.find((v: any) => v.id === volunteerId);

    // Check if volunteer has any tasks assigned
    const hasAssignedTasks = event?.tasks.some(
      (task: any) => task.assignedTo === volunteerId
    );

    // Don't allow active volunteers with tasks to be changed to waitlisted
    if (volunteer?.assigned && hasAssignedTasks) {
      return;
    }

    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          volunteers: event.volunteers.map((volunteer: any) => {
            if (volunteer.id === volunteerId) {
              return { ...volunteer, assigned: !volunteer.assigned };
            }
            return volunteer;
          }),
        };
      }
      return event;
    });

    // setEvents(updatedEvents);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(updatedEvents.find((event) => event.id === eventId));
    }
  };

  const handleSendUpdate = () => {
    console.log(`Sending update to volunteers of event ${selectedEvent.id}`);
    console.log(`Subject: ${emailUpdate.subject}`);
    console.log(`Message: ${emailUpdate.message}`);

    // actual email sending logic (INTEGRATE BACKEND)
    // In production, you would call your API here, for example:
    // const response = await fetch('/api/send-mass-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     eventId: selectedEvent.id,
    //     subject: emailUpdate.subject,
    //     message: emailUpdate.message
    //   })
    // });

    setIsEmailOpen(false);
    setEmailUpdate({ subject: "", message: "" });
  };

  const handleSendVolunteerEmail = () => {
    console.log(
      `Sending email to volunteer ${volunteerEmailData.volunteerName}`
    );
    console.log(`Email: ${volunteerEmailData.volunteerEmail}`);
    console.log(`Subject: ${volunteerEmailData.subject}`);
    console.log(`Message: ${volunteerEmailData.message}`);

    // actual email sending logic (INTEGRATE BACKEND)
    // In production, you would call your API here, for example:
    // const response = await fetch('/api/send-volunteer-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     eventId: selectedEvent.id,
    //     volunteerId: volunteerEmailData.volunteerId,
    //     subject: volunteerEmailData.subject,
    //     message: volunteerEmailData.message
    //   })
    // });

    setIsVolunteerEmailOpen(false);
    setVolunteerEmailData({
      volunteerId: null,
      volunteerName: "",
      volunteerEmail: "",
      subject: "",
      message: "",
    });
  };

  const renderEventCard = (event: any) => {
    const completionPercentage = calculateTaskCompletion(event);
    const taskStats = getTaskStats(event);

    return (
      <div
        key={event.id}
        className="border p-4 rounded-md mb-4 bg-gray-50 dark:bg-gray-800"
      >
        <h3 className="font-semibold text-lg">{event.name}</h3>
        <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
          {event.description || "No description"}
        </p>
        <div className="text-sm mb-2">
          <div>
            📅 {t("_")}
            {format(event.startDate, "MMM dd, yyyy")}
          </div>
          <div>{format(event.endDate, "MMM dd, yyyy")}</div>
          <div>📍 {event.location || "No location specified"}</div>
        </div>
        {/* Task completion indicator */}
        {event.tasks.length > 0 && (
          <div className="mt-3 mb-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>{t("task_completion")}</span>
              <span>
                {completionPercentage}%{t("_")}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />

            <div className="flex gap-2 mt-2">
              {taskStats.completed > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-300 dark:text-black"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />{" "}
                  {taskStats.completed}
                </Badge>
              )}
              {taskStats.pending > 0 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-300 dark:text-black"
                >
                  <Clock className="h-3 w-3 mr-1" /> {taskStats.pending}
                </Badge>
              )}
              {taskStats.unassigned > 0 && (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-300 dark:text-black"
                >
                  <Circle className="h-3 w-3 mr-1" /> {taskStats.unassigned}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2 mt-2">
          <Button size="sm" onClick={() => handleEdit(event._id)} tabIndex={0}>
            {t("details")}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(event.id)}
            tabIndex={0}
          >
            {t("delete")}
          </Button>
        </div>
      </div>
    );
  };

  const renderHistoryEventCard = (event: any) => {
    const completionPercentage =
      event.tasks && event.tasks.length > 0
        ? calculateTaskCompletion(event)
        : 0;
    // const taskStats = getTaskStats(event);

    return (
      <div
        key={event._id}
        className="border p-4 rounded-md mb-4 bg-gray-50 dark:bg-gray-800"
      >
        <h3 className="font-semibold text-lg">{event.name}</h3>
        <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
          {event.description || "No description"}
        </p>
        <div className="text-sm mb-2 mt-4">
          <div className="pb-2">
            📅 {format(new Date(event.startDate), "MMM dd, yyyy")} -{" "}
            {format(new Date(event.endDate), "MMM dd, yyyy")}
          </div>
          <div>📍 {event.location || "No location specified"}</div>
        </div>

        {/* Task completion indicator */}
        {event.tasks && event.tasks.length > 0 && (
          <div className="mt-3 mb-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Tasks Completed</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}

        {/* Feedback indicator */}
        {event.feedbacks && event.feedbacks.length > 0 && (
          <div className="mt-3 mb-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-300 dark:text-black"
            >
              <MessageCircle className="h-3 w-3 mr-1" />{" "}
              {event.feedbacks.length} Feedbacks
            </Badge>
          </div>
        )}

        <div className="flex space-x-2 mt-2">
          <Button size="sm" onClick={() => handleEdit(event._id)} tabIndex={0}>
            View Details
          </Button>
        </div>
      </div>
    );
  };

  const CompletedEventDetailView = ({
    event,
    onBack,
  }: {
    event: any;
    onBack: () => void;
  }) => {
    return (
      <div className="max-w-5xl mx-auto">
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onBack}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Button>

        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">
                  {event.name}
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 font-medium"
                  >
                    Completed
                  </Badge>
                </CardTitle>
                <div className="mt-2 text-gray-600 dark:text-gray-300 font-medium">
                  Completed on{" "}
                  {format(new Date(event.endDate), "MMMM dd, yyyy")}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 pb-1 border-b dark:border-gray-700">
                  Event Details
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </span>
                    <span className="mt-1">{event.description}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Dates
                    </span>
                    <span className="mt-1">
                      {format(new Date(event.startDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(event.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </span>
                    <span className="mt-1">{event.location}</span>
                  </div>
                </div>

                {/* Volunteer Summary */}
                {event.volunteers && event.volunteers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 pb-1 border-b dark:border-gray-700">
                      Volunteer Summary
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-blue-600 dark:text-blue-300"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <span className="font-medium">
                        Total Volunteers: {event.volunteers.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {event.volunteers.slice(0, 3).map((volunteer: any) => (
                        <div
                          key={volunteer._id}
                          className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {volunteer.displayName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {volunteer.email}
                            </div>
                          </div>
                        </div>
                      ))}
                      {event.volunteers.length > 3 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          And {event.volunteers.length - 3} more volunteers
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 pb-1 border-b dark:border-gray-700">
                    Feedback Summary
                  </h3>
                  {event.feedbacks && event.feedbacks.length > 0 ? (
                    <div className="space-y-4">
                      {event.feedbacks.map((feedback: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                Experience : {feedback.experience || "Loved it!"}
                              </p>
                              <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Learning : {feedback.learnings ?? "Great"}
                              </p>
                            </div>
                            {feedback.rating && (
                              <div className="flex items-center">
                                {[...Array(feedback.rating)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < feedback.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300 fill-gray-300"
                                    }`}
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="mr-1"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              {feedback.respondentId?.displayName ||
                                "Anonymous"}
                            </div>
                            {feedback.date && (
                              <div className="flex items-center ml-4">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="mr-1"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {format(
                                  new Date(feedback.date),
                                  "MMM dd, yyyy"
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        No feedback has been submitted for this event.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-4 pb-1 border-b dark:border-gray-700">
                  Task Summary
                </h3>
                {event.tasks && event.tasks.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Overall Completion</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          100%
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-4 mt-4">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Tasks Breakdown
                      </h4>
                      {event.tasks.map((task: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 border rounded-md bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-green-600 dark:text-green-400 mr-2"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {task.name}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 font-medium"
                            >
                              Completed
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="mt-2 text-gray-600 dark:text-gray-300 ml-6">
                              {task.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No tasks were recorded for this event.
                    </p>
                  </div>
                )}

                {/* Impact Section - New Addition */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 pb-1 border-b dark:border-gray-700">
                    Event Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                        151
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        People Assessed
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                        74
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Referrals Made
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Add this function to your component
  // const ensureVolunteerTaskConsistency = (eventsList: any) => {
  //   return eventsList.map((event: any) => {
  //     // Find all volunteers with assigned tasks
  //     const volunteersWithTasks = new Set();
  //     event.tasks.forEach((task: any) => {
  //       if (task.assignedTo !== null) {
  //         volunteersWithTasks.add(task.assignedTo);
  //       }
  //     });

  //     // Ensure these volunteers are marked as assigned
  //     const updatedVolunteers = event.volunteers.map((volunteer: any) => {
  //       if (volunteersWithTasks.has(volunteer.id) && !volunteer.assigned) {
  //         return { ...volunteer, assigned: true };
  //       }
  //       return volunteer;
  //     });

  //     return { ...event, volunteers: updatedVolunteers };
  //   });
  // };

  // Use this function when setting initial events and after any event update
  // For example, in useEffect:
  useEffect(() => {
    // setEvents((prevEvents) => ensureVolunteerTaskConsistency(prevEvents));
  }, []); // Run once on component mount

  const { t } = useLanguage();

  return (
    <div className="p-4">
      <Link to="/admin" className="text-primary-600">
        <Button variant="outline" className="mb-4">
          <ArrowLeft size={16} />
          {t("back_to_dashboard")}
        </Button>
      </Link>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{t("event_management")}</h2>
        <Link to="/admin/events/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("add_event")}
          </Button>
        </Link>
      </div>
      {selectedEvent ? (
        isHistoryView ? (
          <div>
            {/* <Button
            variant="outline"
            className="mb-4"
            onClick={() => setSelectedEvent(null)}
          >{t("back_to_events")}</Button> */}
            <CompletedEventDetailView
              event={selectedEvent}
              onBack={() => setSelectedEvent(null)}
            />
          </div>
        ) : (
          <div>
            <>
              {/* {selectedEvent && ( */}
              {/* <> */}
              {/* Existing event details section */}
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Back to Events
              </Button>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsEditEventOpen(true)}>
                  {t("edit_event_details")}
                </Button>
              </div>

              <EventEditDialog
                event={selectedEvent}
                isOpen={isEditEventOpen}
                onOpenChange={setIsEditEventOpen}
                onSave={handleSaveEventChanges}
              />
            </>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedEvent.name}</CardTitle>
                    {selectedEvent.tasks.length > 0 && (
                      <div className="mt-2">
                        <Progress
                          value={calculateTaskCompletion(selectedEvent)}
                          className="h-2 w-32"
                        />
                        <span className="text-xs text-gray-500 ml-2 dark:text-white">
                          {calculateTaskCompletion(selectedEvent)}
                          {t("_complete")}
                        </span>
                      </div>
                    )}
                  </div>
                  <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Mail className="h-4 w-4 mr-2" />
                        {t("send_update")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {t("send_update_to_volunteers")}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="subject" className="text-right">
                            {t("subject")}
                          </Label>
                          <Input
                            id="subject"
                            value={emailUpdate.subject}
                            onChange={(e) =>
                              setEmailUpdate({
                                ...emailUpdate,
                                subject: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="message" className="text-right">
                            {t("message")}
                          </Label>
                          <Textarea
                            id="message"
                            value={emailUpdate.message}
                            onChange={(e) =>
                              setEmailUpdate({
                                ...emailUpdate,
                                message: e.target.value,
                              })
                            }
                            className="col-span-3"
                            rows={5}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSendUpdate}>
                          {t("send_to_all_volunteers")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {t("event_details")}
                      </h3>
                      <div className="space-y-2">
                        <p>
                          <strong>{t("description_")}</strong>{" "}
                          {selectedEvent.description}
                        </p>
                        <p>
                          <strong>{t("status_")}</strong> {selectedEvent.status}
                        </p>
                        <p>
                          <strong>{t("dates_")}</strong>{" "}
                          {format(selectedEvent.startDate, "MMM dd, yyyy")}
                          {t("_")}{" "}
                          {format(selectedEvent.endDate, "MMM dd, yyyy")}
                        </p>
                        <p>
                          <strong>{t("location_")}</strong>{" "}
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>
                    {selectedEvent.applications &&
                      selectedEvent.applications.length > 0 && (
                        <div className="mt-8 ">
                          <h3 className="text-lg font-semibold mb-4 ">
                            {t("applications")}
                          </h3>

                          <div className="space-y-2 ">
                            {selectedEvent.applications.map(
                              (application: any) => {
                                return (
                                  <ApplicationCard
                                    key={application._id}
                                    setSelectedEvent={setSelectedEvent}
                                    application={application}
                                  />
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    {selectedEvent.volunteers &&
                      selectedEvent.volunteers.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">
                            {t("volunteers")}
                          </h3>

                          <div className="space-y-2">
                            {selectedEvent.volunteers.map((volunteer: any) => {
                              // Check if volunteer has any tasks assigned
                              const hasAssignedTasks = selectedEvent.tasks.some(
                                (task: any) => task.assignedTo === volunteer._id
                              );

                              return (
                                <div
                                  key={volunteer._id}
                                  className="flex items-center justify-between border p-3 rounded-md"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {volunteer.displayName}
                                    </p>
                                    <p className="text-sm text-gray-500 darktext-white">
                                      {volunteer.email}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {volunteer.assigned && (
                                      <Button
                                        variant="outline"
                                        className={`${
                                          volunteer.assigned
                                            ? "bg-green-50 text-green-700"
                                            : "bg-yellow-50 text-yellow-700"
                                        }`}
                                        onClick={() => {
                                          handleAssignVolunteer(
                                            selectedEvent.id,
                                            volunteer.id
                                          );
                                        }}
                                      >
                                        {t("_active_")}
                                        {/* {volunteer.assigned ? "Active" : "Waitlisted"} */}
                                      </Button>
                                    )}
                                    {hasAssignedTasks &&
                                      !volunteer.assigned && (
                                        <Badge
                                          variant="outline"
                                          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-300 dark:text-black"
                                        >
                                          {t("has_assigned_tasks")}
                                        </Badge>
                                      )}

                                    {/* Add this new email button */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setVolunteerEmailData({
                                          volunteerId: volunteer.id,
                                          volunteerName: volunteer.name,
                                          volunteerEmail: volunteer.email,
                                          subject: `Update regarding ${selectedEvent.title}`,
                                          message: "",
                                        });
                                        setIsVolunteerEmailOpen(true);
                                      }}
                                    >
                                      <Mail className="h-3 w-3 mr-1" />
                                      {t("email")}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{t("tasks")}</h3>
                      <Dialog
                        open={isAddTaskOpen}
                        onOpenChange={setIsAddTaskOpen}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("add_task")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("add_new_task")}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="taskTitle" className="text-right">
                                {t("task")}
                              </Label>
                              <Input
                                id="taskTitle"
                                value={newTask.title}
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    title: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="taskDescription"
                                className="text-right"
                              >
                                {t("description")}
                              </Label>
                              <Textarea
                                id="taskDescription"
                                value={newTask.description}
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    description: e.target.value,
                                  })
                                }
                                className="col-span-3"
                                placeholder="Additional details about the task"
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="assignTo" className="text-right">
                                {t("assign_to")}
                              </Label>
                              <Select
                                value={newTask.assignedTo}
                                onValueChange={(value) =>
                                  setNewTask({ ...newTask, assignedTo: value })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select volunteer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* <SelectItem value="none">Unassigned</SelectItem> */}
                                  {selectedEvent.volunteers.map(
                                    (volunteer: any) => (
                                      <SelectItem
                                        key={volunteer._id}
                                        value={volunteer._id}
                                      >
                                        {volunteer.displayName}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="completed" className="text-right">
                                {t("status")}
                              </Label>
                              <div className="flex items-center space-x-2 col-span-3">
                                <Checkbox
                                  id="completed"
                                  checked={newTask.completed}
                                  onCheckedChange={(checked: any) =>
                                    setNewTask({
                                      ...newTask,
                                      completed: checked,
                                    })
                                  }
                                />
                                <label
                                  htmlFor="completed"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {t("mark_as_completed")}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onClick={handleAddTask}
                              disabled={isPending}
                            >
                              {t("save_task")}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Task stats and filter tabs */}
                    <div className="mb-4">
                      <div className="flex space-x-2 mb-2">
                        <Badge
                          variant={taskFilter === "all" ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setTaskFilter("all")}
                        >
                          {t("all_")}
                          {selectedEvent.tasks.length}
                          {t(")")}
                        </Badge>
                        <Badge
                          variant={
                            taskFilter === "completed" ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setTaskFilter("completed")}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {t("completed_")}
                          {getTaskStats(selectedEvent).completed}
                          {t(")")}
                        </Badge>
                        <Badge
                          variant={
                            taskFilter === "pending" ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setTaskFilter("pending")}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {t("pending_")}
                          {getTaskStats(selectedEvent).pending}
                          {t(")")}
                        </Badge>
                        <Badge
                          variant={
                            taskFilter === "unassigned" ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setTaskFilter("unassigned")}
                        >
                          <Circle className="h-3 w-3 mr-1" />
                          {t("unassigned_")}
                          {getTaskStats(selectedEvent).unassigned}
                          {t(")")}
                        </Badge>
                      </div>
                    </div>

                    {/* Updated Task Cards with appropriate action buttons */}
                    <div className="space-y-2">
                      {selectedEvent.tasks && selectedEvent.tasks.length > 0 ? (
                        getFilteredTasks(selectedEvent, taskFilter).map(
                          (task: Task, i: number) => (
                            <div
                              key={i}
                              className={`border p-3 rounded-md ${
                                task.status === TaskStatus.COMPLETED
                                  ? "bg-green-50 border-green-200 dark:bg-green-300 dark:border-green-400"
                                  : task.assignedTo === null
                                  ? "bg-gray-50 border-gray-200 dark:bg-gray-300 dark:border-gray-400"
                                  : "bg-yellow-50 border-yellow-200 dark:bg-yellow-800 dark:border-yellow-400"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p
                                  className={`font-medium ${
                                    task.status === TaskStatus.COMPLETED
                                      ? "text-gray-500"
                                      : ""
                                  }`}
                                >
                                  {task.name}
                                </p>
                                <div className="flex gap-1">
                                  {/* Dynamic button based on task state */}
                                  {task.status === TaskStatus.COMPLETED ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setTaskToAssign({
                                          ...task,
                                          actionType: "reopen",
                                        });
                                        setIsTaskAssignOpen(true);
                                      }}
                                    >
                                      <RotateCcw className="h-3 w-3 mr-1" />
                                      {t("reopen")}
                                    </Button>
                                  ) : task.assignedTo !== null ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setTaskToAssign({
                                          ...task,
                                          actionType: "complete",
                                        });
                                        setIsTaskAssignOpen(true);
                                      }}
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      {t("complete")}
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setTaskToAssign({
                                          ...task,
                                          actionType: "reassign",
                                        });
                                        setIsTaskAssignOpen(true);
                                      }}
                                      className="text-gray-500 dark:text-black"
                                    >
                                      <ArrowRight className="h-3 w-3 mr-1" />
                                      {t("assign")}
                                    </Button>
                                  )}

                                  {/* Always show reassign button for assigned tasks */}
                                  {/* {task.assignedTo !== null && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setTaskToAssign({
                                        ...task,
                                        actionType: "reassign",
                                      });
                                      setIsTaskAssignOpen(true);
                                    }}
                                    className="text-gray-500 dark:text-black"
                                  >
                                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                                    Reassign
                                  </Button>
                                )} */}
                                </div>
                              </div>

                              {/* Task description - will only show if description exists */}
                              {task.description && (
                                <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 dark:text-black">
                                  {task.assignedTo
                                    ? `Assigned to: ${
                                        selectedEvent.volunteers.find(
                                          (v: any) => v._id === task.assignedTo
                                        )?.displayName || "Unknown"
                                      }`
                                    : "Unassigned"}
                                </p>
                                {/* <Badge
                                variant="outline"
                                className={`${
                                  task.status === TaskStatus.COMPLETED
                                    ? "bg-green-100 text-geen-800"
                                    : task.assignedTo === null
                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-300 dark:text-black"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-black"
                                }`}
                              >
                                {task.status === TaskStatus.COMPLETED
                                  ? "Completed"
                                  : task.assignedTo === null
                                  ? "Unassigned"
                                  : "Pending"}
                              </Badge> */}
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 text-sm dark:text-gray-300">
                          {t("no_tasks_added_for_this_event_yet_")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task assignment dialog */}
            <Dialog open={isTaskAssignOpen} onOpenChange={setIsTaskAssignOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {taskToAssign?.actionType === "reassign"
                      ? "Reassign Task"
                      : taskToAssign?.actionType === "complete"
                      ? "Complete Task"
                      : taskToAssign?.actionType === "reopen"
                      ? "Reopen Task"
                      : "Assign Task"}
                  </DialogTitle>
                </DialogHeader>
                <div>
                  {taskToAssign && (
                    <div className="mb-4">
                      <p className="font-medium">{taskToAssign.title}</p>
                      {taskToAssign.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {taskToAssign.description}
                        </p>
                      )}
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {t("current_status_")}{" "}
                          <Badge
                            variant="outline"
                            className={`${
                              taskToAssign.status === TaskStatus.COMPLETED
                                ? "bg-green-100 text-green-800"
                                : taskToAssign.assignedTo === null
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-300 dark:text-gray-800"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-800"
                            }`}
                          >
                            {taskToAssign.status === TaskStatus.COMPLETED
                              ? "Completed"
                              : taskToAssign.assignedTo === null
                              ? "Unassigned"
                              : "Pending"}
                          </Badge>
                        </p>
                        {taskToAssign.assignedTo && (
                          <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">
                            {t("currently_assigned_to_")}{" "}
                            {selectedEvent.volunteers.find(
                              (v: any) => v.id === taskToAssign.assignedTo
                            )?.name || "Unknown"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {taskToAssign?.actionType === "reassign" && (
                    <div className="grid grid-cols-4 items-center gap-4 mb-4">
                      <Label htmlFor="assignToVolunteer" className="text-right">
                        {t("assign_to")}
                      </Label>
                      <Select
                        onValueChange={(value) => handleTaskAssignment(value)}
                        defaultValue={
                          taskToAssign?.assignedTo
                            ? taskToAssign.assignedTo.toString()
                            : "none"
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select volunteer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            {t("unassigned")}
                          </SelectItem>
                          {selectedEvent?.volunteers.map((volunteer: any) => (
                            <SelectItem
                              key={volunteer.id}
                              value={volunteer.id.toString()}
                            >
                              {volunteer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* For complete or reopen actions, show a confirmation message */}
                  {(taskToAssign?.actionType === "complete" ||
                    taskToAssign?.actionType === "reopen") && (
                    <div className="mt-4 mb-4">
                      <p>
                        {t("are_you_sure_you_want_to")}{" "}
                        {taskToAssign?.actionType === "complete"
                          ? "mark this task as complete"
                          : "reopen this task"}
                        {t("_")}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsTaskAssignOpen(false)}
                    >
                      {t("cancel")}
                    </Button>

                    {/* Conditional confirm button based on action type */}
                    {taskToAssign?.actionType === "complete" && (
                      <Button
                        onClick={() =>
                          handleTaskAssignment(
                            taskToAssign.assignedTo?.toString()
                          )
                        }
                      >
                        {t("mark_complete")}
                      </Button>
                    )}

                    {taskToAssign?.actionType === "reopen" && (
                      <Button
                        onClick={() =>
                          handleTaskAssignment(
                            taskToAssign.assignedTo?.toString()
                          )
                        }
                      >
                        {t("reopen_task")}
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )
      ) : (
        <div>
          <Tabs
            defaultValue={EventStatus.ACTIVE}
            onValueChange={(value) => setActiveTab(value as EventStatus)}
            value={activeTab}
          >
            <TabsList
              onKeyDown={(e) => {
                const tabTriggers = document.querySelectorAll('[role="tab"]');
                const currentIndex = Array.from(tabTriggers).findIndex(
                  (tab) => tab === document.activeElement
                );

                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const nextIndex = (currentIndex + 1) % tabTriggers.length;
                  (tabTriggers[nextIndex] as HTMLElement).focus();
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const prevIndex =
                    (currentIndex - 1 + tabTriggers.length) %
                    tabTriggers.length;
                  (tabTriggers[prevIndex] as HTMLElement).focus();
                }
              }}
            >
              <TabsTrigger
                id="tab-active"
                value={EventStatus.ACTIVE}
                role="tab"
                tabIndex={activeTab === EventStatus.ACTIVE ? 0 : -1}
                aria-selected={activeTab === EventStatus.ACTIVE}
                aria-controls="panel-active"
              >
                {t("active")}
              </TabsTrigger>
              {/* <TabsTrigger
                id="tab-underReview"
                value="underReview"
                role="tab"
                tabIndex={activeTab === "underReview" ? 0 : -1}
                aria-selected={activeTab === "underReview"}
                aria-controls="panel-underReview"
              >{t("under_review")}</TabsTrigger> */}
              <TabsTrigger
                id="tab-history"
                value={EventStatus.COMPLETED}
                role="tab"
                tabIndex={activeTab === EventStatus.COMPLETED ? 0 : -1}
                aria-selected={activeTab === EventStatus.COMPLETED}
                aria-controls="panel-history"
              >
                {t("history")}
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value={EventStatus.ACTIVE}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-active"
              className="mt-4"
            >
              {/* {events
                .filter((event) => event.status === "active")
                .map((event) => renderEventCard(event))}
              {events.filter((event) => event.status === "active").length ===
                0 && <p>No active events.</p>} */}

              {isLoading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : isError ? (
                <p className="text-red-400">
                  {t("error_loading_programs_please_try_again_")}
                </p>
              ) : events.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    {t("showing")} {events.length}{" "}
                    {events.length === 1 ? "event" : "events"}
                  </div>
                  <div className=" grid grid-cols-1 md:grid-cols-2 overflow-y-auto lg:grid-cols-3 gap-6">
                    {events.map((eachEvent) => renderEventCard(eachEvent))}
                  </div>

                  <div ref={loadMoreRef} className="py-4 flex justify-center">
                    {isFetchingNextPage ? (
                      <Loader />
                    ) : (
                      hasNextPage && (
                        <span className="text-customNeutral-40 w-full center dark:text-contrast-30">
                          <Loader />
                        </span>
                      )
                    )}
                  </div>
                </>
              ) : (
                !isLoading && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    {t("no_events_found_matching_your_criteria_")}
                  </p>
                )
              )}
            </TabsContent>
            {/* <TabsContent
              value="underReview"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-underReview"
              className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {events
                .filter((event) => event.status === "underReview")
                .map((event) => renderEventCard(event))}
              {events.filter((event) => event.status === "underReview")
                .length === 0 && <p>{t("no_events_under_review_")}</p>}
            </TabsContent> */}
            <TabsContent
              value={EventStatus.COMPLETED}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-history"
              className="mt-4"
            >
              {/* {events
                .filter((event) => event.status === "history")
                .map((event) => renderEventCard(event))}
              {events.filter((event) => event.status === "history").length ===
                0 && <p>{t("no_past_events_")}</p>} */}
              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                Showing {dummyCompletedEvents.length} completed{" "}
                {dummyCompletedEvents.length === 1 ? "event" : "events"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto lg:grid-cols-3 gap-6">
                {dummyCompletedEvents.map((eachEvent) =>
                  renderHistoryEventCard(eachEvent)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Add the individual volunteer email dialog */}
      <Dialog
        open={isVolunteerEmailOpen}
        onOpenChange={setIsVolunteerEmailOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("send_email_to")}
              {volunteerEmailData.volunteerName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm mb-2">
              <p>
                {t("recipient_")}
                {volunteerEmailData.volunteerName}
              </p>
              <p>
                {t("email_")}
                {volunteerEmailData.volunteerEmail}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="volunteer-subject" className="text-right">
                {t("subject")}
              </Label>
              <Input
                id="volunteer-subject"
                value={volunteerEmailData.subject}
                onChange={(e) =>
                  setVolunteerEmailData({
                    ...volunteerEmailData,
                    subject: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="volunteer-message" className="text-right">
                {t("message")}
              </Label>
              <Textarea
                id="volunteer-message"
                value={volunteerEmailData.message}
                onChange={(e) =>
                  setVolunteerEmailData({
                    ...volunteerEmailData,
                    message: e.target.value,
                  })
                }
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSendVolunteerEmail}>
              {t("send_email")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagementPage;
