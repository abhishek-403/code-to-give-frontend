import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Availabitity } from "@/lib/constants/server-constants";
import useLanguage from "@/lib/hooks/useLang";
import { generateVolunteerCertificate } from "@/utils/certificateGenerator";
import { formatDateFromDate } from "@/utils/formattedDate";
import { useNavigate } from "react-router-dom";

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
  voluneerEmail: string;
  voluneerName: string;
}

// const formatDateFromDate = (date: Date) => {
//   return date.toDateString();
// };

const HistoryEventCard = ({ event }: { event: HistoryEventType }) => {
  const navigate = useNavigate();

  const handleDownloadCertificate = () => {
    // TODO: Replace with actual user data from backend
    const mockUserData = {
      name: event.voluneerName,
      email: event.voluneerEmail,
      eventName: event.name,
      eventDate: formatDateFromDate(event.endDate),
    };
    generateVolunteerCertificate(mockUserData);
  };

  const handleProvideFeedback = () => {
    // Navigate to feedback page with event details
    navigate(`/feedback/${event._id}`, {
      state: {
        eventId: event._id,
        eventName: event.name,
      },
    });
  };

  const { t } = useLanguage();

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
                  {t("feedback_done")}
                </Badge>
              )}
            </div>

            <CardDescription className="text-sm flex gap-1 flex-wrap text-gray-700 dark:text-gray-300 mt-2">
              {event.volunteeringDomains &&
                event.volunteeringDomains.slice(3).map((domain) => (
                  <Badge
                    key={domain.id}
                    variant="outline"
                    className="border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    {domain.name}
                  </Badge>
                ))}

              {event.availability &&
                event.availability.map((avail) => (
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
              {t("_")}{" "}
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {formatDateFromDate(event.startDate)} {t("to")}{" "}
              {formatDateFromDate(event.endDate)}
            </span>
          </p>
          <div className="grid md:grid-cols-2 grid-cols-1 flex-wrap gap-4 w-full">
            <Button onClick={handleDownloadCertificate} className="">
              {t("download_certificate")}
            </Button>
            {!event.feedbackSubmitted && (
              <Button
                onClick={handleProvideFeedback}
                variant="secondary"
                className="flex-"
              >
                {t("provide_feedback")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryEventCard;
