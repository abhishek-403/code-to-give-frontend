import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRightLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const EventManagementPage = () => {
  // Enhanced mock data for existing events - now with task completion status
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Donation Drive",
      description: "Collect donations for the needy.",
      status: "active",
      startDate: new Date(2025, 3, 28),
      endDate: new Date(2025, 3, 30),
      location: "Community Center",
      volunteers: [
        {
          id: 101,
          name: "John Doe",
          email: "john@example.com",
          assigned: true,
        },
        {
          id: 102,
          name: "Jane Smith",
          email: "jane@example.com",
          assigned: true, // Changed from false to true since she has assigned tasks
        },
      ],
      tasks: [
        {
          id: 201,
          title: "Set up donation boxes",
          description: "Place donation boxes at all entrances and common areas",
          assignedTo: 101,
          completed: true,
        },
        {
          id: 202,
          title: "Sort and pack donations",
          description: "Organize and pack donated items for distribution",
          assignedTo: 101,
          completed: true,
        },
        {
          id: 211,
          title: "Coordinate with local shelters",
          description: "Arrange for donation drop-offs at local shelters",
          assignedTo: 101,
          completed: false,
        },
        {
          id: 212,
          title: "Thank you notes",
          description: "Write thank you notes for all donors",
          assignedTo: 102,
          completed: false,
        },
      ],
    },
    {
      id: 2,
      title: "Walk-a-thon",
      description: "A charity walk to raise awareness.",
      status: "active",
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 4, 15),
      location: "City Park",
      volunteers: [
        {
          id: 103,
          name: "Mike Johnson",
          email: "mike@example.com",
          assigned: true,
        },
        {
          id: 104,
          name: "Sarah Williams",
          email: "sarah@example.com",
          assigned: false,
        },
      ],
      tasks: [
        {
          id: 203,
          title: "Set up registration booth",
          description: "Prepare registration booth for participants",
          assignedTo: 103,
          completed: true,
        },
        {
          id: 204,
          title: "Distribute t-shirts and bibs",
          description: "Hand out t-shirts and bibs to registered participants",
          assignedTo: 103,
          completed: true,
        },
        {
          id: 205,
          title: "Prepare route maps",
          description: "Print and distribute route maps for participants",
          assignedTo: 103,
          completed: true,
        },
      ],
    },
    {
      id: 3,
      title: "Fundraiser",
      description: "Raise funds for the organization.",
      status: "underReview",
      startDate: new Date(2025, 4, 5),
      endDate: new Date(2025, 4, 7),
      location: "Hotel Conference Room",
      volunteers: [],
      tasks: [
        {
          id: 206,
          title: "Send out invites",
          description: "Email invites to potential donors",
          assignedTo: null,
          completed: false,
        },
        {
          id: 207,
          title: "Prepare presentation",
          description: "Create a presentation for the fundraiser event",
          assignedTo: null,
          completed: false,
        },
      ],
    },
    {
      id: 4,
      title: "Awareness Campaign",
      description: "Promote awareness about our cause.",
      status: "history",
      startDate: new Date(2025, 2, 10),
      endDate: new Date(2025, 2, 20),
      location: "Multiple Locations",
      volunteers: [
        {
          id: 105,
          name: "Alex Thompson",
          email: "alex@example.com",
          assigned: true,
        },
      ],
      tasks: [
        {
          id: 208,
          title: "Distribute flyers",
          description: "Hand out flyers at local events and gatherings",
          assignedTo: 105,
          completed: true,
        },
        {
          id: 209,
          title: "Social media campaign",
          description: "Create social media posts to raise awareness",
          assignedTo: 105,
          completed: true,
        },
        {
          id: 210,
          title: "Local radio ads",
          description: "Coordinate with local radio stations for ads",
          assignedTo: 105,
          completed: true,
        },
      ],
    },
  ]);

  // State for the currently selected event (for detailed view)
  const [selectedEvent, setSelectedEvent] = useState(null);

  // State for task filtering in detail view
  const [taskFilter, setTaskFilter] = useState("all");

  // State for new event form
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    status: "underReview",
  });

  // State for new task form
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "none",
    completed: false,
  });

  const [isTaskAssignOpen, setIsTaskAssignOpen] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState(null);

  // State for email update form
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailUpdate, setEmailUpdate] = useState({
    subject: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState("active");

  // Calculate task completion percentage for an event
  const calculateTaskCompletion = (event) => {
    if (event.tasks.length === 0) return 0;
    const completedTasks = event.tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / event.tasks.length) * 100);
  };

  // Enhanced task assignment handler to manage all task states
  // Replace the handleTaskAssignment function with this improved version
  const handleTaskAssignment = (newAssigneeId) => {
    if (!selectedEvent || !taskToAssign) return;

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        // Find if the volunteer is waitlisted
        const assigneeVolunteer = event.volunteers.find(
          (v) => v.id === parseInt(newAssigneeId)
        );

        // First update volunteer status if needed
        let updatedVolunteers = event.volunteers;
        if (
          newAssigneeId !== "none" &&
          assigneeVolunteer &&
          !assigneeVolunteer.assigned
        ) {
          // Auto-activate waitlisted volunteer when assigned a task
          updatedVolunteers = event.volunteers.map((volunteer) => {
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
          tasks: event.tasks.map((task) => {
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

    setEvents(updatedEvents);
    if (selectedEvent) {
      setSelectedEvent(
        updatedEvents.find((event) => event.id === selectedEvent.id)
      );
    }

    setIsTaskAssignOpen(false);
    setTaskToAssign(null);
  };

  // New function to handle task completion directly
  const handleMarkTaskComplete = (eventId, taskId) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: event.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, completed: true };
            }
            return task;
          }),
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(updatedEvents.find((event) => event.id === eventId));
    }
  };

  // New function to reopen a completed task
  const handleReopenTask = (eventId, taskId) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: event.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, completed: false };
            }
            return task;
          }),
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(updatedEvents.find((event) => event.id === eventId));
    }
  };

  // Calculate task statistics for the selected event
  const getTaskStats = (event) => {
    if (!event) return { completed: 0, pending: 0, unassigned: 0, total: 0 };

    const completed = event.tasks.filter((task) => task.completed).length;
    const unassigned = event.tasks.filter(
      (task) => task.assignedTo === null
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
  const getFilteredTasks = (event, filter) => {
    if (!event) return [];

    switch (filter) {
      case "completed":
        return event.tasks.filter((task) => task.completed);
      case "pending":
        return event.tasks.filter(
          (task) => !task.completed && task.assignedTo !== null
        );
      case "unassigned":
        return event.tasks.filter((task) => task.assignedTo === null);
      default:
        return event.tasks;
    }
  };

  const handleEdit = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    setSelectedEvent(eventToEdit);
    setTaskFilter("all"); // Reset filter when selecting a new event
  };

  const handleDelete = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
  };

  const handleAddEvent = () => {
    const eventToAdd = {
      ...newEvent,
      id: events.length + 1,
      volunteers: [],
      tasks: [],
    };

    setEvents([...events, eventToAdd]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      status: "underReview",
    });
  };

  const handleAddTask = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          tasks: [
            ...event.tasks,
            {
              id: Date.now(),
              title: newTask.title,
              description: newTask.description,
              assignedTo:
                newTask.assignedTo === "none"
                  ? null
                  : parseInt(newTask.assignedTo),
              completed: newTask.completed,
            },
          ],
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setIsAddTaskOpen(false);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "none",
      completed: false,
    });

    // Update selected event
    setSelectedEvent(
      updatedEvents.find((event) => event.id === selectedEvent.id)
    );
  };

  // Replace the handleAssignVolunteer function with this version
  const handleAssignVolunteer = (eventId, volunteerId) => {
    const event = events.find((e) => e.id === eventId);
    const volunteer = event?.volunteers.find((v) => v.id === volunteerId);

    // Check if volunteer has any tasks assigned
    const hasAssignedTasks = event?.tasks.some(
      (task) => task.assignedTo === volunteerId
    );

    // Don't allow active volunteers with tasks to be changed to waitlisted
    if (volunteer?.assigned && hasAssignedTasks) {
      return;
    }

    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          volunteers: event.volunteers.map((volunteer) => {
            if (volunteer.id === volunteerId) {
              return { ...volunteer, assigned: !volunteer.assigned };
            }
            return volunteer;
          }),
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(updatedEvents.find((event) => event.id === eventId));
    }
  };

  const handleSendUpdate = () => {
    // Here you would implement actual email sending logic (INTEGRATE BACKEND)
    console.log(`Sending update to volunteers of event ${selectedEvent.id}`);
    console.log(`Subject: ${emailUpdate.subject}`);
    console.log(`Message: ${emailUpdate.message}`);

    setIsEmailOpen(false);
    setEmailUpdate({ subject: "", message: "" });
  };

  const renderEventCard = (event) => {
    const completionPercentage = calculateTaskCompletion(event);
    const taskStats = getTaskStats(event);

    return (
      <div key={event.id} className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold text-lg">{event.title}</h3>
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
          <Button size="sm" onClick={() => handleEdit(event.id)} tabIndex={0}>
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
  const ensureVolunteerTaskConsistency = (eventsList) => {
    return eventsList.map((event) => {
      // Find all volunteers with assigned tasks
      const volunteersWithTasks = new Set();
      event.tasks.forEach((task) => {
        if (task.assignedTo !== null) {
          volunteersWithTasks.add(task.assignedTo);
        }
      });

      // Ensure these volunteers are marked as assigned
      const updatedVolunteers = event.volunteers.map((volunteer) => {
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
    setEvents((prevEvents) => ensureVolunteerTaskConsistency(prevEvents));
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

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedEvent.title}</CardTitle>
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
                  <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Description:</strong> {selectedEvent.description}
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
                                <SelectItem value="none">Unassigned</SelectItem>
                                {selectedEvent.volunteers.map((volunteer) => (
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="completed" className="text-right">
                              Status
                            </Label>
                            <div className="flex items-center space-x-2 col-span-3">
                              <Checkbox
                                id="completed"
                                checked={newTask.completed}
                                onCheckedChange={(checked) =>
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
                          <Button onClick={handleAddTask}>Save Task</Button>
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
                        (task) => (
                          <div
                            key={task.id}
                            className={`border p-3 rounded-md ${
                              task.completed
                                ? "bg-green-50 border-green-200"
                                : task.assignedTo === null
                                ? "bg-gray-50 border-gray-200"
                                : "bg-yellow-50 border-yellow-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p
                                className={`font-medium ${
                                  task.completed ? "text-gray-500" : ""
                                }`}
                              >
                                {task.title}
                              </p>
                              <div className="flex gap-1">
                                {/* Dynamic button based on task state */}
                                {task.completed ? (
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
                                {task.assignedTo !== null && (
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
                                )}
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
                                        (v) => v.id === task.assignedTo
                                      )?.name || "Unknown"
                                    }`
                                  : "Unassigned"}
                              </p>
                              <Badge
                                variant="outline"
                                className={`${
                                  task.completed
                                    ? "bg-green-100 text-green-800"
                                    : task.assignedTo === null
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {task.completed
                                  ? "Completed"
                                  : task.assignedTo === null
                                  ? "Unassigned"
                                  : "Pending"}
                              </Badge>
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

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Volunteers</h3>
                {selectedEvent.volunteers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEvent.volunteers.map((volunteer) => {
                      // Check if volunteer has any tasks assigned
                      const hasAssignedTasks = selectedEvent.tasks.some(
                        (task) => task.assignedTo === volunteer.id
                      );

                      return (
                        <div
                          key={volunteer.id}
                          className="flex items-center justify-between border p-3 rounded-md"
                        >
                          <div>
                            <p className="font-medium">{volunteer.name}</p>
                            <p className="text-sm text-gray-500">
                              {volunteer.email}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {/* <Badge
                              variant={
                                volunteer.assigned ? "success" : "secondary"
                              }
                              className={`cursor-pointer ${
                                hasAssignedTasks
                                  ? "opacity-50"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                if (!hasAssignedTasks) {
                                  handleAssignVolunteer(
                                    selectedEvent.id,
                                    volunteer.id
                                  );
                                }
                              }}
                            >
                              {volunteer.assigned ? "Active" : "Waitlisted"}
                            </Badge> */}
                            {/* implement above using button instead of badge. If active, have green bg else, have yellow bg */}
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
                              {volunteer.assigned ? "Active" : "Waitlisted"}
                            </Button>
                            {hasAssignedTasks && !volunteer.assigned && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700"
                              >
                                Has assigned tasks
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No volunteers assigned to this event yet.
                  </p>
                )}
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
                            taskToAssign.completed
                              ? "bg-green-100 text-green-800"
                              : taskToAssign.assignedTo === null
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {taskToAssign.completed
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
                            (v) => v.id === taskToAssign.assignedTo
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
                        {selectedEvent?.volunteers.map((volunteer) => (
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

                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const nextIndex = (currentIndex + 1) % tabTriggers.length;
                  tabTriggers[nextIndex].focus();
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const prevIndex =
                    (currentIndex - 1 + tabTriggers.length) %
                    tabTriggers.length;
                  tabTriggers[prevIndex].focus();
                }
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
              className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {events
                .filter((event) => event.status === "active")
                .map((event) => renderEventCard(event))}
              {events.filter((event) => event.status === "active").length ===
                0 && <p>No active events.</p>}
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
    </div>
  );
};

export default EventManagementPage;
