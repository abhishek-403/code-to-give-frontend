import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft } from 'lucide-react';
import { FeedbackSchema, ExperienceRating } from '@/types/feedback-types';

// TODO: Replace with actual backend API call
interface EventDetails {
	name: string;
	date: string;
}

async function fetchEventDetails(eventId: string): Promise<EventDetails> {
  // TODO: Replace with actual API call using the eventId
  console.log(`Fetching details for event: ${eventId}`);
  return {
    name: `Event ${eventId}`,
    date: new Date().toDateString()
  };
}

interface FeedbackData {
  eventId: string;
  rating: number;
  experience: string;
  wouldRecommend: boolean;
  learnings?: string;
  suggestions?: string;
}

async function submitFeedback(data: FeedbackData): Promise<void> {
	try {
		// TODO: Replace with actual API endpoint
		console.log("Submitting feedback:", data);
		// const response = await fetch('/api/feedback', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify(data),
		// });
		// if (!response.ok) throw new Error('Failed to submit feedback');
	} catch (error) {
		console.error('Error submitting feedback:', error);
	}
}

function FeedbackForm() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [formData, setFormData] = useState({
    eventId: eventId || '',
    rating: 3,
    experience: '',
    wouldRecommend: true,
    learnings: '',
    suggestions: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  useEffect(() => {
    async function loadEventDetails() {
      if (eventId) {
        try {
          const details = await fetchEventDetails(eventId);
          setEventDetails(details);
        } catch (error) {
          console.error('Failed to fetch event details', error);
          navigate('/');
        }
      }
    }
    loadEventDetails();
  }, [eventId, navigate]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  }

function handleRecommendationChange(value: string): void {
	setFormData(prev => ({
		...prev,
		wouldRecommend: value === 'yes'
	}));
}

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const validatedData = FeedbackSchema.parse(formData);
      setErrors({});
      await submitFeedback(validatedData);
      navigate('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.reduce<Record<string, string>>((acc, curr) => {
          const path = curr.path[0];
          if (typeof path === 'string') {
            acc[path] = curr.message;
          }
          return acc;
        }, {});
        setErrors(errorMessages);
      }
    }
  }

  function handleGoBack() {
    navigate('/');
  }

  if (!eventId || !eventDetails) {
    return <div className="text-center mt-10">Loading event details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex items-center mb-4">
        <Button variant="outline" onClick={handleGoBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback for {eventDetails.name}</CardTitle>
          <p className="text-muted-foreground">Event Date: {eventDetails.date}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Input */}
            <div>
              <Label htmlFor="rating">Overall Experience Rating</Label>
              <RadioGroup
                onValueChange={value => setFormData(prev => ({ ...prev, rating: Number(value) }))}
                defaultValue="3"
                className="flex flex-wrap space-x-4 mt-2"
              >
                {Object.entries(ExperienceRating)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([label, value]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                      <Label htmlFor={`rating-${value}`}>{label}</Label>
                    </div>
                  ))}
              </RadioGroup>
              {errors.rating && <p className="text-red-500" aria-live="polite">{errors.rating}</p>}
            </div>

            {/* Experience Details */}
            <div>
              <Label htmlFor="experience">Describe Your Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Share details about your event experience"
                className="mt-2"
              />
              {errors.experience && <p className="text-red-500" aria-live="polite">{errors.experience}</p>}
            </div>

            {/* Learnings Input */}
            <div>
              <Label htmlFor="learnings">What Did You Learn?</Label>
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
              <Label>Would You Recommend This Event?</Label>
              <RadioGroup
                onValueChange={handleRecommendationChange}
                defaultValue="yes"
                className="flex flex-wrap space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="recommend-yes" />
                  <Label htmlFor="recommend-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="recommend-no" />
                  <Label htmlFor="recommend-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Suggestions */}
            <div>
              <Label htmlFor="suggestions">Additional Suggestions</Label>
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
            <Button type="submit" className="w-full">
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeedbackForm;
