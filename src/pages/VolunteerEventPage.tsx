import React, { useState, useMemo } from "react";
import { ArrowLeft, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, Task } from "@/types/event";
import { Types } from "mongoose";
import { Link } from "react-router";

const VolunteerEventPage: React.FC = () => {
  // Dummy data that closely matches backend structure
  const dummyEvent: Event = {
    _id: new Types.ObjectId(),
    name: "Community Charity Drive",
    description: "Annual community service event supporting local charities",
    location: "Community Center",
    startDate: new Date("2024-07-15"),
    endDate: new Date("2024-07-16"),
    status: "UPCOMING", // Assuming this is from your EventStatus enum
    createdBy: new Types.ObjectId(),
    volunteeringDomains: [],
    availability: "ALL",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const dummyTasks: Task[] = [
    {
      _id: new Types.ObjectId(),
      name: "Set up Registration Desk",
      description: "Prepare registration materials and set up welcome area",
      eventId: dummyEvent._id,
      assignedTo: new Types.ObjectId(),
      assignedBy: new Types.ObjectId(),
      status: "PENDING",
      priority: "high",
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-07-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new Types.ObjectId(),
      name: "Manage Food Distribution",
      description:
        "Coordinate food serving and ensure dietary requirements are met",
      eventId: dummyEvent._id,
      assignedTo: new Types.ObjectId(),
      assignedBy: new Types.ObjectId(),
      status: "PENDING",
      priority: "medium",
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-07-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // State management for tasks (simulating backend interaction)
  const [event, setEvent] = useState<Event>(dummyEvent);
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [taskFilter, setTaskFilter] = useState<"all" | "COMPLETED" | "PENDING">(
    "all"
  );

  // Calculate progress
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) => taskFilter === "all" || task.status === taskFilter
    );
  }, [tasks, taskFilter]);

  // Toggle task status (simulating backend update)
  const toggleTaskStatus = (taskId: Types.ObjectId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id.equals(taskId)
          ? {
              ...task,
              status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED",
              completedAt: task.status === "COMPLETED" ? undefined : new Date(),
            }
          : task
      )
    );

    // TODO: Replace with actual API call
    // eventService.updateTaskStatus(taskId, newStatus)
  };

  return (
    <div className="container mx-auto p-6">
      <Link to="/" className="flex items-center space-x-2 mb-4">
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-700 mb-4">{event.description}</p>

      {/* Progress Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={progress} className="flex-grow" />
            <span className="text-sm text-gray-600">
              {completedTasks} / {totalTasks} Tasks
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Task Filters */}
      <div className="flex space-x-2 mb-4">
        <Badge
          variant={taskFilter === "all" ? "default" : "outline"}
          onClick={() => setTaskFilter("all")}
          className="cursor-pointer"
        >
          All Tasks
        </Badge>
        <Badge
          variant={taskFilter === "COMPLETED" ? "default" : "outline"}
          onClick={() => setTaskFilter("COMPLETED")}
          className="cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Completed
        </Badge>
        <Badge
          variant={taskFilter === "PENDING" ? "default" : "outline"}
          onClick={() => setTaskFilter("PENDING")}
          className="cursor-pointer"
        >
          <Clock className="h-4 w-4 mr-1" />
          Pending
        </Badge>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task._id.toString()}
              className={`
          ${
            task.status === "COMPLETED"
              ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
              : "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800"
          }
        `}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{task.name}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={
                        task.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                      }
                    >
                      {task.status === "COMPLETED" ? "Completed" : "Pending"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleTaskStatus(task._id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Toggle Status
                    </Button>
                  </div>
                </div>
                {task.startDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {task.startDate.toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerEventPage;
