import {
  AuthProviders,
  EventStatus,
  TaskStatus,
  UserRole,
} from "@/lib/constants/server-constants";
import { Types } from "mongoose";

// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  profileImage?: string;
  role: UserRole;
  authProvider: AuthProviders;
  age?: number;
  location?: string;
  interests?: string[];
  myApplications?: Types.ObjectId[];
  myEvents?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Event Types
export interface Event {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  createdBy: Types.ObjectId;
  volunteeringDomains: Types.ObjectId[];
  availability: string[] | string;
  template?: Types.ObjectId;
  applications?: Types.ObjectId[];
  volunteers?: Types.ObjectId[];
  tasks?: Types.ObjectId[];
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface Task {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  assignedTo: Types.ObjectId;
  assignedBy: Types.ObjectId;
  status: TaskStatus;
  eventId: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  priority?: "low" | "medium" | "high";
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Data Transfer Objects (DTOs)
export interface UpdateEventDto {
  name?: string;
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  volunteeringDomains?: {
    domain: Types.ObjectId;
    customName?: string;
    customDescription?: string;
  }[];
  availability?: string[] | string;
  isTemplate?: boolean;
  templateName?: string;
}

export interface CreateTaskDto {
  name: string;
  description?: string;
  eventId: Types.ObjectId;
  assignedTo: Types.ObjectId;
  assignedBy: Types.ObjectId;
  status?: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  priority?: "low" | "medium" | "high";
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  status?: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  priority?: "low" | "medium" | "high";
  completedAt?: Date;
}

// Utility Types for Frontend State Management
export interface VolunteerEventState {
  event: Event;
  userTasks: Task[];
  isLoading: boolean;
  error?: string;
}

// Service Interface for Future Backend Integration
export interface EventService {
  getEventById(eventId: string): Promise<Event>;
  getVolunteerTasks(eventId: string, volunteerId: string): Promise<Task[]>;
  updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task>;
}
