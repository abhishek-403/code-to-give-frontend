import ApplicationCard from "@/components/ApplicationDetailsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Calendar } from "@/components/ui/calendar";
import { EventStatus, TaskStatus } from "@/lib/constants/server-constants";
import {
  useAddTaskToEventMutation,
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
  Circle,
  Clock,
  Mail,
  PlusCircle,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { useUpdateEventMutation } from "@/services/useUpdateEventMutation";

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
  const [editedEvent, setEditedEvent] = useState({
    title: event?.title || "", // Use empty string as fallback
    description: event?.description || "",
    startDate: event?.startDate ? new Date(event.startDate) : new Date(),
    endDate: event?.endDate ? new Date(event.endDate) : new Date(),
    location: event?.location || "",
  });

  useEffect(() => {
    if (isOpen && event) {
      setEditedEvent({
        title: event.title || "",
        description: event.description || "",
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate ? new Date(event.endDate) : new Date(),
        location: event.location || "",
      });
    }
  }, [isOpen, event]);

  const handleSave = async () => {
    // try {
    //   await updateEvent(event._id, editedEvent);
    //   onOpenChange(false); // Close dialog on successful update
    //   // Optionally, you can add a toast or snackbar notification
    // } catch (error) {
    //   // Handle error (show error message to user)
    //   console.error("Failed to update event", error);
    // }
    onSave({
      title: editedEvent.title,
      description: editedEvent.description,
      startDate: editedEvent.startDate,
      endDate: editedEvent.endDate,
      location: editedEvent.location,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Event Details</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[500px] pr-16 pt-5 pb-5">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Event Title
              </Label>
              <Input
                id="title"
                value={editedEvent.title}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
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
              <Label className="text-right">Start Date</Label>
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
              <Label className="text-right">End Date</Label>
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
                Location
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
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EventManagementPage = () => {
  // Enhanced mock data for existing events - now with task completion status

  const [activeTab, setActiveTab] = useState<any>("active");

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const handleSaveEventChanges = (updatedEventDetails) => {
    // Temporarily update the selectedEvent state
    setSelectedEvent((prevEvent) => ({
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    // refetch,
  } = useInfiniteEventsForAdmin({
    // activeTab,
    // ...filterParams,
  });

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  const events = data?.pages.flatMap((page) => page.events) || [];

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
    if (!event) return { completed: 0, pending: 0, unassigned: 0, total: 0 };

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
    const eventToEdit = events.find((event) => event._id === id);
    setSelectedEvent(eventToEdit);
    setTaskFilter("all"); // Reset filter when selecting a new event
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
          <div>
            📅 {format(event.startDate, "MMM dd, yyyy")} -{" "}
            {format(event.endDate, "MMM dd, yyyy")}
          </div>
          <div>📍 {event.location}</div>
        </div>

        {/* Task completion indicator */}
        {event.tasks.length > 0 && (
          <div className="mt-3 mb-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Task Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />

            <div className="flex gap-2 mt-2">
              {taskStats.completed > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />{" "}
                  {taskStats.completed}
                </Badge>
              )}
              {taskStats.pending > 0 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  <Clock className="h-3 w-3 mr-1" /> {taskStats.pending}
                </Badge>
              )}
              {taskStats.unassigned > 0 && (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200"
                >
                  <Circle className="h-3 w-3 mr-1" /> {taskStats.unassigned}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2 mt-2">
          <Button size="sm" onClick={() => handleEdit(event._id)} tabIndex={0}>
            Details
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(event.id)}
            tabIndex={0}
          >
            Delete
          </Button>
        </div>
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

  return (
    <div className="p-4">
      <Link to="/admin" className="text-primary-600">
        <Button variant="outline" className="mb-4">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </Link>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Event Management</h2>
        <Link to="/admin/events/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </Link>
      </div>

      {selectedEvent ? (
        <div>
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => setSelectedEvent(null)}
          >
            Back to Events
          </Button>

          {selectedEvent && (
            <>
              {/* Existing event details section */}
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsEditEventOpen(true)}>
                  Edit Event Details
                </Button>
              </div>

              <EventEditDialog
                event={selectedEvent}
                isOpen={isEditEventOpen}
                onOpenChange={setIsEditEventOpen}
                onSave={handleSaveEventChanges}
              />
            </>
          )}
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
                      <span className="text-xs text-gray-500 ml-2">
                        {calculateTaskCompletion(selectedEvent)}% Complete
                      </span>
                    </div>
                  )}
                </div>
                <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Update to Volunteers</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                          Subject
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
                          Message
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
                        Send to All Volunteers
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
                      Event Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedEvent.description}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedEvent.status}
                      </p>
                      <p>
                        <strong>Dates:</strong>{" "}
                        {format(selectedEvent.startDate, "MMM dd, yyyy")} -{" "}
                        {format(selectedEvent.endDate, "MMM dd, yyyy")}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                  {selectedEvent.applications.length > 0 && (
                    <div className="mt-8 ">
                      <h3 className="text-lg font-semibold mb-4 ">
                        Applications
                      </h3>

                      <div className="space-y-2 ">
                        {selectedEvent.applications.map((application: any) => {
                          return (
                            <ApplicationCard
                              setSelectedEvent={setSelectedEvent}
                              application={application}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {selectedEvent.volunteers.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Volunteers</h3>

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
                                <p className="text-sm text-gray-500">
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
                                    "Active"
                                    {/* {volunteer.assigned ? "Active" : "Waitlisted"} */}
                                  </Button>
                                )}
                                {hasAssignedTasks && !volunteer.assigned && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700"
                                  >
                                    Has assigned tasks
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
                                  Email
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
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <Dialog
                      open={isAddTaskOpen}
                      onOpenChange={setIsAddTaskOpen}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taskTitle" className="text-right">
                              Task
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
                              Description
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
                              Assign To
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
                              Status
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
                                Mark as completed
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAddTask} disabled={isPending}>
                            Save Task
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
                        All ({selectedEvent.tasks.length})
                      </Badge>
                      <Badge
                        variant={
                          taskFilter === "completed" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setTaskFilter("completed")}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed ({getTaskStats(selectedEvent).completed})
                      </Badge>
                      <Badge
                        variant={
                          taskFilter === "pending" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setTaskFilter("pending")}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Pending ({getTaskStats(selectedEvent).pending})
                      </Badge>
                      <Badge
                        variant={
                          taskFilter === "unassigned" ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setTaskFilter("unassigned")}
                      >
                        <Circle className="h-3 w-3 mr-1" />
                        Unassigned ({getTaskStats(selectedEvent).unassigned})
                      </Badge>
                    </div>
                  </div>

                  {/* Updated Task Cards with appropriate action buttons */}
                  <div className="space-y-2">
                    {selectedEvent.tasks.length > 0 ? (
                      getFilteredTasks(selectedEvent, taskFilter).map(
                        (task: Task, i: number) => (
                          <div
                            key={i}
                            className={`border p-3 rounded-md ${
                              task.status === TaskStatus.COMPLETED
                                ? "bg-green-100 border-green-200"
                                : task.assignedTo === null
                                ? "bg-gray-50 border-gray-200"
                                : "bg-yellow-50 border-yellow-200"
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
                                    Reopen
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
                                    Complete
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
                                  >
                                    <ArrowRight className="h-3 w-3 mr-1" />
                                    Assign
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
                                  >
                                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                                    Reassign
                                  </Button>
                                )} */}
                              </div>
                            </div>

                            {/* Task description - will only show if description exists */}
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex justify-between items-center">
                              <p className="text-xs">
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
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-yellow-100 text-yellow-800"
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
                      <p className="text-gray-500 text-sm">
                        No tasks added for this event yet.
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
                      <p className="text-sm text-gray-500">
                        Current status:{" "}
                        <Badge
                          variant="outline"
                          className={`${
                            taskToAssign.status === TaskStatus.COMPLETED
                              ? "bg-green-100 text-green-800"
                              : taskToAssign.assignedTo === null
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
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
                        <p className="text-sm text-gray-500 mt-1">
                          Currently assigned to:{" "}
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
                      Assign To
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
                        <SelectItem value="none">Unassigned</SelectItem>
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
                      Are you sure you want to{" "}
                      {taskToAssign?.actionType === "complete"
                        ? "mark this task as complete"
                        : "reopen this task"}
                      ?
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsTaskAssignOpen(false)}
                  >
                    Cancel
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
                      Mark Complete
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
                      Reopen Task
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div>
          <Tabs
            defaultValue="active"
            onValueChange={setActiveTab}
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
                value="active"
                role="tab"
                tabIndex={activeTab === "active" ? 0 : -1}
                aria-selected={activeTab === "active"}
                aria-controls="panel-active"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                id="tab-underReview"
                value="underReview"
                role="tab"
                tabIndex={activeTab === "underReview" ? 0 : -1}
                aria-selected={activeTab === "underReview"}
                aria-controls="panel-underReview"
              >
                Under Review
              </TabsTrigger>
              <TabsTrigger
                id="tab-history"
                value="history"
                role="tab"
                tabIndex={activeTab === "history" ? 0 : -1}
                aria-selected={activeTab === "history"}
                aria-controls="panel-history"
              >
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="active"
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
                  Error loading programs. Please try again.
                </p>
              ) : events.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    Showing {events.length}{" "}
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
                    No events found matching your criteria.
                  </p>
                )
              )}
            </TabsContent>
            <TabsContent
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
                .length === 0 && <p>No events under review.</p>}
            </TabsContent>
            <TabsContent
              value="history"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-history"
              className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {events
                .filter((event) => event.status === "history")
                .map((event) => renderEventCard(event))}
              {events.filter((event) => event.status === "history").length ===
                0 && <p>No past events.</p>}
            </TabsContent>
          </Tabs>

          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                {/* Date pickers would go here */}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddEvent}>Add Event</Button>
              </div>
            </DialogContent>
          </Dialog>
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
              Send Email to {volunteerEmailData.volunteerName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm mb-2">
              <p>Recipient: {volunteerEmailData.volunteerName}</p>
              <p>Email: {volunteerEmailData.volunteerEmail}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="volunteer-subject" className="text-right">
                Subject
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
                Message
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
            <Button onClick={handleSendVolunteerEmail}>Send Email</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagementPage;
