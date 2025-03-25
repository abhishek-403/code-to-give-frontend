import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useLanguage from "@/lib/hooks/useLang";
import { useSubmitFeedBackMutation } from "@/services/event";
import { ExperienceRating, FeedbackSchema } from "@/types/feedback-types";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

// TODO: Replace with actual backend API call
interface EventDetails {
  eventName: string;
  eventId: string;
}

interface FeedbackData {
  eventId: string;
  rating: number;
  experience: string;
  wouldRecommend: boolean;
  learnings?: string;
  suggestions?: string;
}

function FeedbackForm() {
  // const { eventId } = useParams();
  const { t } = useLanguage()
  const navigate = useNavigate();
  const locate = useLocation();
  const { eventId, eventName } = locate.state || {};
  const [eventDetails, setEventDetails] = useState<EventDetails | null>({
    eventId,
    eventName,
  });
  const [formData, setFormData] = useState({
    eventId: eventId,
    rating: 3,
    experience: "",
    wouldRecommend: true,
    learnings: "",
    suggestions: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  useEffect(() => {
    setEventDetails({ eventId, eventName });
  }, [eventId, eventName]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  }

  function handleRecommendationChange(value: string): void {
    setFormData((prev) => ({
      ...prev,
      wouldRecommend: value === "yes",
    }));
  }

  const { mutate } = useSubmitFeedBackMutation();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const validatedData = FeedbackSchema.parse(formData);
      setErrors({});

      mutate(validatedData);

      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.reduce<Record<string, string>>(
          (acc, curr) => {
            const path = curr.path[0];
            if (typeof path === "string") {
              acc[path] = curr.message;
            }
            return acc;
          },
          {}
        );
        setErrors(errorMessages);
      }
    }
  }

  function handleGoBack() {
    navigate("/");
  }

  if (!eventId || !eventDetails) {
    return <div className="text-center mt-10">{t("loading_event_details_")}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex items-center mb-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("back_to_events")}</span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("feedback_for")}{eventDetails.eventName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Input */}
            <div>
              <Label htmlFor="rating">{t("overall_experience_rating")}</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rating: Number(value) }))
                }
                defaultValue="3"
                className="flex flex-wrap space-x-4 mt-2"
              >
                {Object.entries(ExperienceRating)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([label, value]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={value.toString()}
                        id={`rating-${value}`}
                      />
                      <Label htmlFor={`rating-${value}`}>{label}</Label>
                    </div>
                  ))}
              </RadioGroup>
              {errors.rating && (
                <p className="text-red-500" aria-live="polite">
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Experience Details */}
            <div>
              <Label htmlFor="experience">{t("describe_your_experience")}</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Share details about your event experience"
                className="mt-2"
              />
              {errors.experience && (
                <p className="text-red-500" aria-live="polite">
                  {errors.experience}
                </p>
              )}
            </div>

            {/* Learnings Input */}
            <div>
              <Label htmlFor="learnings">{t("what_did_you_learn_")}</Label>
              <Textarea
                id="learnings"
                name="learnings"
                value={formData.learnings || ""}
                onChange={handleChange}
                placeholder="Optional: Share your key takeaways"
                className="mt-2"
              />
            </div>

            {/* Recommendation */}
            <div>
              <Label>{t("would_you_recommend_this_event_")}</Label>
              <RadioGroup
                onValueChange={handleRecommendationChange}
                defaultValue="yes"
                className="flex flex-wrap space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="recommend-yes" />
                  <Label htmlFor="recommend-yes">{t("yes")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="recommend-no" />
                  <Label htmlFor="recommend-no">{t("no")}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Suggestions */}
            <div>
              <Label htmlFor="suggestions">{t("additional_suggestions")}</Label>
              <Textarea
                id="suggestions"
                name="suggestions"
                value={formData.suggestions || ""}
                onChange={handleChange}
                placeholder="Optional: How can we improve?"
                className="mt-2"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">{t("submit_feedback")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeedbackForm;
