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
  PlusCircle,
  RotateCcw,
  MessageCircle,
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
  const { t } = useLanguage()
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
  const { mutate, isPending } = useEditEventMutation();

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
        title: editedEvent.title,
        description: editedEvent.description,
        startDate: new Date(editedEvent.startDate),
        endDate: new Date(editedEvent.endDate),
        location: editedEvent.location,
        status: editedEvent.status ,
      },
    });
    onSave({
      title: editedEvent.title,
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
              <Label htmlFor="title" className="text-right">{t("event_title")}</Label>
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
              <Label htmlFor="description" className="text-right">{t("description")}</Label>
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
              <Label htmlFor="description" className="text-right">{t("status")}</Label>
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
              <Label htmlFor="location" className="text-right">{t("location")}</Label>
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
          >{t("cancel")}</Button>
          <Button type="submit" onClick={handleSave}>{t("save_changes")}</Button>
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

  const [isAddEventOpen, setIsAddEventOpen] = useState<any>(false);
  const [newEvent, setNewEvent] = useState<any>({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    status: "underReview",
  });

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
  const [dummyCompletedEvents, setDummyCompletedEvents] = useState([
    {
      _id: "completed-event-1",
      name: "Annual Beach Cleanup 2023",
      description:
        "Our successful beach cleanup event that removed over 500 pounds of trash from the shoreline.",
      location: "Coastal Park Beach",
      startDate: new Date(2023, 9, 15), // October 15, 2023
      endDate: new Date(2023, 9, 15),
      status: EventStatus.COMPLETED,
      applications: [],
      tasks: [
        {
          _id: "c-task-1",
          name: "Volunteer Registration",
          description: "Register and assign volunteers",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c-task-2",
          name: "Equipment Distribution",
          description: "Hand out gloves and bags",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c-task-3",
          name: "Area Assignment",
          description: "Assign beach areas to teams",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c-task-4",
          name: "Waste Collection",
          description: "Collect and sort waste",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
      ],
      volunteers: [
        {
          _id: "c-vol-1",
          displayName: "Anna Johnson",
          email: "anna@example.com",
          assigned: true,
        },
        {
          _id: "c-vol-2",
          displayName: "Michael Chen",
          email: "mchen@example.com",
          assigned: true,
        },
        {
          _id: "c-vol-3",
          displayName: "Sarah Williams",
          email: "swilliams@example.com",
          assigned: true,
        },
      ],
      feedbacks: [
        {
          _id: "feedback-1",
          title: "Great Experience",
          content:
            "This was so well organized! I'll definitely join the next one.",
          rating: 5,
          user: { displayName: "Anna Johnson" },
          date: new Date(2023, 9, 16),
        },
        {
          _id: "feedback-2",
          title: "Good but tiring",
          content:
            "The event was well organized but could have used more rest breaks.",
          rating: 4,
          user: { displayName: "Michael Chen" },
          date: new Date(2023, 9, 17),
        },
      ],
    },
    {
      _id: "completed-event-2",
      name: "Community Garden Planting",
      description:
        "We successfully planted 200 native plants in the community garden.",
      location: "Downtown Community Garden",
      startDate: new Date(2023, 7, 10), // August 10, 2023
      endDate: new Date(2023, 7, 10),
      status: EventStatus.COMPLETED,
      applications: [],
      tasks: [
        {
          _id: "c2-task-1",
          name: "Site Preparation",
          description: "Prepare planting sites",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c2-task-2",
          name: "Plant Distribution",
          description: "Hand out plants to volunteers",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c2-task-3",
          name: "Planting Guidance",
          description: "Guide volunteers on planting techniques",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
      ],
      volunteers: [
        {
          _id: "c2-vol-1",
          displayName: "Robert Garcia",
          email: "rgarcia@example.com",
          assigned: true,
        },
        {
          _id: "c2-vol-2",
          displayName: "Emma Wilson",
          email: "ewilson@example.com",
          assigned: true,
        },
      ],
      feedbacks: [
        {
          _id: "c2-feedback-1",
          title: "Educational and Fun",
          content:
            "I learned so much about native plants. The instructors were very knowledgeable.",
          rating: 5,
          user: { displayName: "Emma Wilson" },
          date: new Date(2023, 7, 11),
        },
      ],
    },
    {
      _id: "completed-event-3",
      name: "Youth Mentorship Workshop",
      description: "A successful workshop connecting mentors with local youth.",
      location: "Community Center",
      startDate: new Date(2023, 5, 25), // June 25, 2023
      endDate: new Date(2023, 5, 25),
      status: EventStatus.COMPLETED,
      applications: [],
      tasks: [
        {
          _id: "c3-task-1",
          name: "Registration",
          description: "Register attendees",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c3-task-2",
          name: "Workshop Setup",
          description: "Prepare workshop materials",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c3-task-3",
          name: "Session Facilitation",
          description: "Facilitate workshop sessions",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
        {
          _id: "c3-task-4",
          name: "Networking Session",
          description: "Organize networking break",
          status: TaskStatus.COMPLETED,
          assignedTo: null,
        },
      ],
      volunteers: [
        {
          _id: "c3-vol-1",
          displayName: "David Kumar",
          email: "dkumar@example.com",
          assigned: true,
        },
        {
          _id: "c3-vol-2",
          displayName: "Jessica Patel",
          email: "jpatel@example.com",
          assigned: true,
        },
        {
          _id: "c3-vol-3",
          displayName: "Marcus Johnson",
          email: "mjohnson@example.com",
          assigned: true,
        },
      ],
      feedbacks: [
        {
          _id: "c3-feedback-1",
          title: "Life-Changing",
          content:
            "The connection I made with my mentee has been incredible. Thank you for organizing this!",
          rating: 5,
          user: { displayName: "Jessica Patel" },
          date: new Date(2023, 5, 26),
        },
        {
          _id: "c3-feedback-2",
          title: "Well Organized",
          content:
            "The workshop was structured perfectly. Great job to the organizers.",
          rating: 4,
          user: { displayName: "David Kumar" },
          date: new Date(2023, 5, 27),
        },
        {
          _id: "c3-feedback-3",
          title: "Needs More Time",
          content:
            "Great concept but would be better if it was a full-day workshop rather than half-day.",
          rating: 3,
          user: { displayName: "Marcus Johnson" },
          date: new Date(2023, 5, 28),
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
  const handleMarkTaskComplete = (eventId: any, taskId: any) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: event.tasks.map((task: any) => {
            if (task.id === taskId) {
              return { ...task, completed: true };
            }
            return task;
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

  // New function to reopen a completed task
  // New function to reopen a completed task
  const handleReopenTask = (eventId: any, taskId: any) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: event.tasks.map((task: any) => {
            if (task.id === taskId) {
              return { ...task, completed: false };
            }
            return task;
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

  const handleDelete = (id: any) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    // setEvents(updatedEvents);
  };

  const handleAddEvent = async () => {
    const eventToAdd = {
      ...newEvent,
      id: events.length + 1, // In production, this ID would come from the server
      volunteers: [],
      tasks: [],
    };

    // In production, you would add API call here, for example:
    // const response = await fetch('/api/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventToAdd)
    // });
    // const savedEvent = await response.json();
    // setEvents([...events, savedEvent]);

    // For now, using local state:
    // setEvents([...events, eventToAdd]);
    setIsAddEventOpen(false);
    // setNewEvent({
    //   title: "",
    //   description: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   location: "",
    //   status: "underReview",
    // });
  };
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
      <div key={event.id} className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">{event.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{event.description}</p>
        <div className="text-sm mb-2">
          <div>📅 {t("_")}{format(event.startDate, "MMM dd, yyyy")}
          </div>
          <div>
            {format(event.endDate, "MMM dd, yyyy")}
          </div>
          <div>{t("_")}📍 {event.location}</div>
        </div>
        {/* Task completion indicator */}
        {event.tasks.length > 0 && (
          <div className="mt-3 mb-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>{t("task_completion")}</span>
              <span>{completionPercentage}{t("_")}</span>
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
          <Button size="sm" onClick={() => handleEdit(event._id)} tabIndex={0}>{t("details")}</Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(event.id)}
            tabIndex={0}
          >{t("delete")}</Button>
        </div>
      </div>
    );
  };

  const renderHistoryEventCard = (event: any) => {
    const completionPercentage =
      event.tasks && event.tasks.length > 0
        ? calculateTaskCompletion(event)
        : 0;
    const taskStats = getTaskStats(event);

    return (
      <div
        key={event._id}
        className="border p-4 rounded-md mb-4 bg-gray-50 dark:bg-gray-800"
      >
        <h3 className="font-semibold text-lg">{event.name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {event.description || "No description"}
        </p>
        <div className="text-sm mb-2">
          <div>
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
      <div>
        <Button variant="outline" className="mb-4" onClick={onBack}>
          Back to Events
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {event.name}{" "}
                  <Badge variant="outline" className="ml-2 bg-green-300 dark:bg-green-500 dark:text-black">
                    Completed
                  </Badge>
                </CardTitle>
                <div className="mt-2 text-black dark:text-white">
                  Completed on{" "}
                  {format(new Date(event.endDate), "MMMM dd, yyyy")}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Description:</strong> {event.description}
                  </p>
                  <p>
                    <strong>Dates:</strong>{" "}
                    {format(new Date(event.startDate), "MMM dd, yyyy")} -{" "}
                    {format(new Date(event.endDate), "MMM dd, yyyy")}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                </div>

                {/* Volunteer Summary */}
                {event.volunteers && event.volunteers.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Volunteer Summary
                    </h3>
                    <p className="text-sm">
                      Total Volunteers:{" "}
                      <span className="font-medium">
                        {event.volunteers.length}
                      </span>
                    </p>
                    <div className="mt-3 space-y-2">
                      {event.volunteers.slice(0, 3).map((volunteer: any) => (
                        <div key={volunteer._id} className="text-sm">
                          <span className="font-medium">
                            {volunteer.displayName}
                          </span>{" "}
                          - {volunteer.email}
                        </div>
                      ))}
                      {event.volunteers.length > 3 && (
                        <p className="text-sm text-black dark:text-white">
                          And {event.volunteers.length - 3} more volunteers
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {event.feedbacks && event.feedbacks.length > 0 ? (
                  <div className="mt-7">
                    <h3 className="text-lg font-semibold mb-2">
                      Feedback Summary
                    </h3>
                    <div className="space-y-3">
                      {event.feedbacks.map((feedback: any, index: number) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {feedback.title || "Feedback"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {feedback.content}
                              </p>
                            </div>
                            {feedback.rating && (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
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
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span>
                              From: {feedback.user?.displayName || "Anonymous"}
                            </span>
                            {feedback.date && (
                              <span className="ml-3">
                                {format(
                                  new Date(feedback.date),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                    <p className="text-sm text-black dark:text-white">
                      No feedback has been submitted for this event.
                    </p>
                  </div>
                )}
              </div>

              {/* Task Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Task Summary</h3>
                {event.tasks && event.tasks.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>Overall Completion</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">Tasks Breakdown</h4>
                      {event.tasks.map((task: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 border rounded-md bg-green-50 border-green-200 dark:bg-green-800 dark:border-green-700"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{task.name}</p>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-300 dark:text-black"
                            >
                              Completed
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    No tasks were recorded for this event.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Add this function to your component
  const ensureVolunteerTaskConsistency = (eventsList: any) => {
    return eventsList.map((event: any) => {
      // Find all volunteers with assigned tasks
      const volunteersWithTasks = new Set();
      event.tasks.forEach((task: any) => {
        if (task.assignedTo !== null) {
          volunteersWithTasks.add(task.assignedTo);
        }
      });

      // Ensure these volunteers are marked as assigned
      const updatedVolunteers = event.volunteers.map((volunteer: any) => {
        if (volunteersWithTasks.has(volunteer.id) && !volunteer.assigned) {
          return { ...volunteer, assigned: true };
        }
        return volunteer;
      });

      return { ...event, volunteers: updatedVolunteers };
    });
  };

  // Use this function when setting initial events and after any event update
  // For example, in useEffect:
  useEffect(() => {
    // setEvents((prevEvents) => ensureVolunteerTaskConsistency(prevEvents));
  }, []); // Run once on component mount

  const { t } = useLanguage()

  return (
    <div className="p-4">
      <Link to="/admin" className="text-primary-600">
        <Button variant="outline" className="mb-4">
          <ArrowLeft size={16} />{t("back_to_dashboard")}</Button>
      </Link>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{t("event_management")}</h2>
        <Link to="/admin/events/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />{t("add_event")}</Button>
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
          </div>)
          :
          (
          <div>
            <>
          {/* {selectedEvent && ( */}
            {/* <> */}
              {/* Existing event details section */}
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Back to Events
              </Button>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsEditEventOpen(true)}>{t("edit_event_details")}</Button>
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
                        {calculateTaskCompletion(selectedEvent)}{t("_complete")}</span>
                    </div>
                  )}
                </div>
                <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Mail className="h-4 w-4 mr-2" />{t("send_update")}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("send_update_to_volunteers")}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">{t("subject")}</Label>
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
                        <Label htmlFor="message" className="text-right">{t("message")}</Label>
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
                      <Button onClick={handleSendUpdate}>{t("send_to_all_volunteers")}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t("event_details")}</h3>
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
                        {format(selectedEvent.startDate, "MMM dd, yyyy")}{t("_")}{" "}
                        {format(selectedEvent.endDate, "MMM dd, yyyy")}
                      </p>
                      <p>
                        <strong>{t("location_")}</strong> {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                  {selectedEvent.applications && selectedEvent.applications.length > 0 && (
                    <div className="mt-8 ">
                      <h3 className="text-lg font-semibold mb-4 ">{t("applications")}</h3>

                      <div className="space-y-2 ">
                        {selectedEvent.applications.map((application: any) => {
                          return (
                            <ApplicationCard
                              key={application._id}
                              setSelectedEvent={setSelectedEvent}
                              application={application}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {selectedEvent.volunteers && selectedEvent.volunteers.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">{t("volunteers")}</h3>

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
                                <p className="text-sm text-gray-500 dark: text-white">
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
                                  >{t("_active_")}{/* {volunteer.assigned ? "Active" : "Waitlisted"} */}
                                  </Button>
                                )}
                                {hasAssignedTasks && !volunteer.assigned && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-300 dark:text-black"
                                  >{t("has_assigned_tasks")}</Badge>
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
                                  <Mail className="h-3 w-3 mr-1" />{t("email")}</Button>
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
                          <PlusCircle className="h-4 w-4 mr-2" />{t("add_task")}</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("add_new_task")}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taskTitle" className="text-right">{t("task")}</Label>
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
                            >{t("description")}</Label>
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
                            <Label htmlFor="assignTo" className="text-right">{t("assign_to")}</Label>
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
                            <Label htmlFor="completed" className="text-right">{t("status")}</Label>
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
                              >{t("mark_as_completed")}</label>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAddTask} disabled={isPending}>{t("save_task")}</Button>
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
                      >{t("all_")}{selectedEvent.tasks.length}{t("_")}</Badge>
                      <Badge
                        variant={
                          taskFilter === "completed" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setTaskFilter("completed")}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />{t("completed_")}{getTaskStats(selectedEvent).completed}{t("_")}</Badge>
                      <Badge
                        variant={
                          taskFilter === "pending" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setTaskFilter("pending")}
                      >
                        <Clock className="h-3 w-3 mr-1" />{t("pending_")}{getTaskStats(selectedEvent).pending}{t("_")}</Badge>
                      <Badge
                        variant={
                          taskFilter === "unassigned" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setTaskFilter("unassigned")}
                      >
                        <Circle className="h-3 w-3 mr-1" />{t("unassigned_")}{getTaskStats(selectedEvent).unassigned}{t("_")}</Badge>
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
                                    <RotateCcw className="h-3 w-3 mr-1" />{t("reopen")}</Button>
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
                                    <CheckCircle2 className="h-3 w-3 mr-1" />{t("complete")}</Button>
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
                                    <ArrowRight className="h-3 w-3 mr-1" />{t("assign")}</Button>
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
                      <p className="text-gray-500 text-sm dark:text-gray-300">{t("no_tasks_added_for_this_event_yet_")}</p>
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
                      <p className="text-sm text-gray-500 dark:text-gray-300">{t("current_status_")}{" "}
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
                        <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">{t("currently_assigned_to_")}{" "}
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
                    <Label htmlFor="assignToVolunteer" className="text-right">{t("assign_to")}</Label>
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
                        <SelectItem value="none">{t("unassigned")}</SelectItem>
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
                    <p>{t("are_you_sure_you_want_to")}{" "}
                      {taskToAssign?.actionType === "complete"
                        ? "mark this task as complete"
                        : "reopen this task"}{t("_")}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsTaskAssignOpen(false)}
                  >{t("cancel")}</Button>

                  {/* Conditional confirm button based on action type */}
                  {taskToAssign?.actionType === "complete" && (
                    <Button
                      onClick={() =>
                        handleTaskAssignment(
                          taskToAssign.assignedTo?.toString()
                        )
                      }
                    >{t("mark_complete")}</Button>
                  )}

                  {taskToAssign?.actionType === "reopen" && (
                    <Button
                      onClick={() =>
                        handleTaskAssignment(
                          taskToAssign.assignedTo?.toString()
                        )
                      }
                    >{t("reopen_task")}</Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )) : (
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

                // if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                //   e.preventDefault();
                //   const nextIndex = (currentIndex + 1) % tabTriggers.length;
                //   tabTriggers[nextIndex].focus();
                // } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                //   e.preventDefault();
                //   const prevIndex =
                //     (currentIndex - 1 + tabTriggers.length) %
                //     tabTriggers.length;
                //   tabTriggers[prevIndex].focus();
                // }
              }}
            >
              <TabsTrigger
                id="tab-active"
                value={EventStatus.ACTIVE}
                role="tab"
                tabIndex={activeTab === EventStatus.ACTIVE ? 0 : -1}
                aria-selected={activeTab === EventStatus.ACTIVE}
                aria-controls="panel-active"
              >{t("active")}</TabsTrigger>
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
              >{t("history")}</TabsTrigger>
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
                <p className="text-red-400">{t("error_loading_programs_please_try_again_")}</p>
              ) : events.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">{t("showing")}{" "}{events.length}{" "}
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
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">{t("no_events_found_matching_your_criteria_")}</p>
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
            <DialogTitle>{t("send_email_to")}{volunteerEmailData.volunteerName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm mb-2">
              <p>{t("recipient_")}{volunteerEmailData.volunteerName}</p>
              <p>{t("email_")}{volunteerEmailData.volunteerEmail}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="volunteer-subject" className="text-right">{t("subject")}</Label>
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
              <Label htmlFor="volunteer-message" className="text-right">{t("message")}</Label>
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
            <Button onClick={handleSendVolunteerEmail}>{t("send_email")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagementPage;
