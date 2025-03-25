import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
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
        <div className="flex w-full justify-between mb-2 items-start">
          <div className="w-full">
            <div className="flex w-full">
              <CardTitle className="text-lg font-semibold">
                {event.name}
              </CardTitle>
              {event.feedbackSubmitted && (
                <Badge className="ml-auto text-[10px] h-fit hover:bg-green-500 bg-green-600">
                  Feedback Done
                </Badge>
              )}
            </div>

            <CardDescription className="text-sm flex gap-1 flex-wrap text-gray-700 dark:text-gray-300 mt-2">
              {event.volunteeringDomains && event.volunteeringDomains.map((domain) => (
                <Badge
                  key={domain.id}
                  variant="outline"
                  className="border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {domain.name}
                </Badge>
              ))}

              {event.availability && event.availability.map((avail) => (
                <Badge
                  key={avail}
                  variant="outline"
                  className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-600"
                >
                  {avail}
                </Badge>
              ))}
            </CardDescription>
          </div>
        </div>

        <p className="text-sm text-gray-800 dark:text-gray-200">
          {event.description || event.location}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm font-medium">
            <span
              className="text-gray-700 dark:text-gray-300"
              aria-hidden="true"
            >
              📅{" "}
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {formatDateFromDate(event.startDate)} to{" "}
              {formatDateFromDate(event.endDate)}
            </span>
          </p>
          <div className="flex space-x-4">
            <Button 
              onClick={handleDownloadCertificate}
              className="w-full"
            >
              Download Certificate
            </Button>
            {!event.feedbackSubmitted && (
              <Button 
                onClick={handleProvideFeedback}
                variant="secondary"
                className="w-full"
              >
                Provide Feedback
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryEventCard;