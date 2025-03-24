import { z } from 'zod';

// Zod schema for validation
export const FeedbackSchema = z.object({
  eventId: z.string(),
  rating: z.number().min(1).max(5),
  experience: z.string().min(10, { message: "Please provide more details about your experience" }).max(500),
  learnings: z.string().optional(),
  wouldRecommend: z.boolean(),
  suggestions: z.string().optional()
});

// TypeScript interface derived from Zod schema
export type FeedbackData = z.infer<typeof FeedbackSchema>;

// Enum for rating options
export enum ExperienceRating {
  VeryPoor = 1,
  Poor = 2,
  Average = 3,
  Good = 4,
  Excellent = 5
}