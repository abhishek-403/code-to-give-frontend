import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EventStatus, TaskStatus } from "@/lib/constants/server-constants";
import { auth } from "@/lib/firebaseConfig";
import useLanguage from "@/lib/hooks/useLang";
import {
  useUpdateVolunteerEventTasksStatus,
  useVolunteerEventTasks,
} from "@/services/user";
import { Event, Task } from "@/types/event";
import Loader from "@/utils/loader";
import LoadingPage from "@/utils/loading-page";
import { ArrowLeft, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Types } from "mongoose";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useParams } from "react-router";

const VolunteerEventPage: React.FC = () => {
  // Dummy data that closely matches backend structure
  const dummyEvent: Event = {
    _id: new Types.ObjectId(),
    name: "Community Charity Drive",
    description: "Annual community service event supporting local charities",
    location: "Community Center",
    startDate: new Date("2024-07-15"),
    endDate: new Date("2024-07-16"),
    status: EventStatus.ACTIVE, // Assuming this is from your EventStatus enum
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
      status: TaskStatus.INPROGRESS,
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
      status: TaskStatus.INPROGRESS,
      priority: "medium",
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-07-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const { eventId } = useParams<{ eventId: string }>();
  // State management for tasks (simulating backend interaction)
  const [user] = useAuthState(auth);
  const {
    data: tsk,
    isLoading,
    refetch,
  } = useVolunteerEventTasks(eventId, !!user);
  const { mutate: updateTaskStatus, isPending } =
    useUpdateVolunteerEventTasksStatus();
  const [event, setEvent] = useState<Event>(dummyEvent);
  const [tasks, setTasks] = useState<Task[] | undefined>(dummyTasks);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "all">("all");
  useEffect(() => {
    setTasks(tsk);
  }, [tsk]);
  const { t } = useLanguage()

  if (!tasks) {
    <div>{t("no_tasks")}</div>;
    return;
  }
  // Calculate progress
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED
  ).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  // Filter tasks based on selected filter
  // const filteredTasks = useMemo(() => {
  //   return tasks.filter(
  //     (task) => taskFilter === "all" || task.status === taskFilter
  //   );
  // }, [tasks, taskFilter]);

  // Toggle task status (simulating backend update)
  const toggleTaskStatus = ({
    id,
    status,
  }: {
    id: Types.ObjectId;
    status: TaskStatus;
  }) => {
    console.log(id);
    updateTaskStatus(
      {
        taskId: id,
        status,
      },
      {
        onSuccess: () => refetch(),
      }
    );
    setTasks((prevTasks: any) =>
      prevTasks.map((task: Task) =>
        task._id.toString() === id.toString()
          ? {
              ...task,
              status,
              completedAt:
                task.status === TaskStatus.COMPLETED
                  ? task.completedAt
                  : undefined,
            }
          : task
      )
    );
    // TODO: Replace with actual API call
    // eventService.updateTaskStatus(taskId, newStatus)
  };

  if (isLoading || isPending)
    return (
      <div className="w-full mt-24 flex items-center justify-center ">
        <Loader />{t("_")}</div>
    );

  return (
    <div className="container mx-auto p-6">
      <Link to="/" className="flex items-center space-x-2 mb-4">
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("back_to_events")}</span>
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-700 mb-4">{event.description}</p>
      {/* Progress Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t("task_progress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={progress} className="flex-grow" />
            <span className="text-sm text-gray-600">
              {completedTasks}{t("_")}{totalTasks}{t("tasks")}</span>
          </div>
        </CardContent>
      </Card>
      {/* Task Filters */}
      <div className="flex space-x-2 mb-4">
        <Badge
          variant={taskFilter === "all" ? "default" : "outline"}
          onClick={() => setTaskFilter("all")}
          className="cursor-pointer"
        >{t("all_tasks")}</Badge>
        <Badge
          variant={taskFilter === TaskStatus.COMPLETED ? "default" : "outline"}
          onClick={() => setTaskFilter(TaskStatus.COMPLETED)}
          className="cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />{t("completed")}</Badge>
        <Badge
          variant={taskFilter === TaskStatus.ASSIGNED ? "default" : "outline"}
          onClick={() => setTaskFilter(TaskStatus.ASSIGNED)}
          className="cursor-pointer"
        >
          <Clock className="h-4 w-4 mr-1" />{t("pending")}</Badge>
      </div>
      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">{t("no_tasks_found_")}</p>
        ) : (
          tasks.map((task) => (
            <Card
              key={task._id.toString()}
              className={`
          ${
            task.status === TaskStatus.COMPLETED
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
                        task.status === TaskStatus.COMPLETED
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                      }
                    >
                      {task.status === TaskStatus.COMPLETED
                        ? TaskStatus.COMPLETED
                        : TaskStatus.ASSIGNED}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toggleTaskStatus({
                          id: task._id,
                          status:
                            task.status === TaskStatus.COMPLETED
                              ? TaskStatus.ASSIGNED
                              : TaskStatus.COMPLETED,
                        })
                      }
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />{t("toggle_status")}</Button>
                  </div>
                </div>
                {task.startDate && (
                  <p className="text-xs text-gray-500 mt-2">{t("due_")}{task.startDate.toLocaleDateString()}
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
