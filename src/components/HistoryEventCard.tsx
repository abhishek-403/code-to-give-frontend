import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateVolunteerCertificate } from '@/utils/certificateGenerator';
import { useNavigate } from 'react-router-dom';
import { Availabitity } from "@/lib/constants/server-constants";

interface EventType {
  _id: string;
  name: string;
  volunteeringDomains: any[];
  dateRange: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location: string;
  availability: [Availabitity];
}

interface HistoryEventType extends EventType {
  // Additional fields specific to history events if needed
  feedbackSubmitted?: boolean;
}
const formatDateFromDate = (date: Date) => {
	  return date.toDateString();
};

const HistoryEventCard = ({ event }: { event: HistoryEventType }) => {
  const navigate = useNavigate();

  const handleDownloadCertificate = () => {
    // TODO: Replace with actual user data from backend
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      eventName: event.name,
      eventDate: formatDateFromDate(event.endDate)
    };
    generateVolunteerCertificate(mockUserData);
  };

  const handleProvideFeedback = () => {
    // Navigate to feedback page with event details
    navigate(`/feedback/${event._id}`, { 
      state: { 
        eventId: event._id, 
        eventName: event.name 
      } 
    });
  };

  return (
    <Card className="w-full flex flex-col justify-between shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.location}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div>
          <p>Date: {formatDateFromDate(event.startDate)} - {formatDateFromDate(event.endDate)}</p>
        </div>
        <div className="flex space-x-4">
          <Button 
            onClick={handleDownloadCertificate}
            className="w-full"
          >
            Download Certificate
          </Button>
          <Button 
            onClick={handleProvideFeedback}
            variant="secondary"
            className="w-full"
          >
            Provide Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryEventCard;