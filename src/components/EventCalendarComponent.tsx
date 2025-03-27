import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import useLanguage from "@/lib/hooks/useLang";

interface EventType {
  _id: string;
  name: string;
  volunteeringDomains: any[];
  dateRange: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location: string;
  availability: string[];
}

interface EventCalendarProps {
  events: EventType[];
}

interface EventPosition {
  event: EventType;
  row: number;
  startIndex: number;
  endIndex: number;
  colorIndex: number; // Added colorIndex property
}

// Color schemes for events - each has a light background, border, hover background, and text color
// Using Tailwind-compatible color classes
const eventColorSchemes = [
  {
    bg: "bg-blue-100",
    bgDark: "dark:bg-blue-800/50",
    border: "border-blue-200",
    borderDark: "dark:border-blue-700",
    hoverBg: "hover:bg-blue-200",
    hoverBgDark: "dark:hover:bg-blue-700/50",
    text: "text-blue-800",
    textDark: "dark:text-blue-200"
  },
  {
    bg: "bg-green-100",
    bgDark: "dark:bg-green-800/50",
    border: "border-green-200",
    borderDark: "dark:border-green-700",
    hoverBg: "hover:bg-green-200",
    hoverBgDark: "dark:hover:bg-green-700/50",
    text: "text-green-800",
    textDark: "dark:text-green-200"
  },
  {
    bg: "bg-purple-100",
    bgDark: "dark:bg-purple-800/50",
    border: "border-purple-200",
    borderDark: "dark:border-purple-700",
    hoverBg: "hover:bg-purple-200",
    hoverBgDark: "dark:hover:bg-purple-700/50",
    text: "text-purple-800",
    textDark: "dark:text-purple-200"
  },
  {
    bg: "bg-amber-100",
    bgDark: "dark:bg-amber-800/50",
    border: "border-amber-200",
    borderDark: "dark:border-amber-700",
    hoverBg: "hover:bg-amber-200",
    hoverBgDark: "dark:hover:bg-amber-700/50",
    text: "text-amber-800",
    textDark: "dark:text-amber-200"
  },
  {
    bg: "bg-rose-100",
    bgDark: "dark:bg-rose-800/50",
    border: "border-rose-200",
    borderDark: "dark:border-rose-700",
    hoverBg: "hover:bg-rose-200",
    hoverBgDark: "dark:hover:bg-rose-700/50",
    text: "text-rose-800",
    textDark: "dark:text-rose-200"
  }
];

const EventCalendarComponent: React.FC<EventCalendarProps> = ({ events }) => {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [eventPositions, setEventPositions] = useState<EventPosition[]>([]);
  const MAX_EVENT_ROWS = 3; // Reduced from 4 to make cells shorter

  // Generate days for the current month view
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate the date of the first day to show (may be from previous month)
    const firstCalendarDay = new Date(firstDay);
    firstCalendarDay.setDate(1 - firstDayOfWeek);
    
    // Calculate how many days to show (always show 6 weeks = 42 days)
    const totalDays = 42;
    
    // Generate all calendar days
    const days: Date[] = [];
    for (let i = 0; i < totalDays; i++) {
      const day = new Date(firstCalendarDay);
      day.setDate(firstCalendarDay.getDate() + i);
      days.push(day);
    }
    
    setCalendarDays(days);
  }, [currentDate]);

  // Calculate event positions for continuous display
  useEffect(() => {
    if (!calendarDays.length) return;
    
    // Sort events by start date
    const sortedEvents = [...events].sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    
    const positions: EventPosition[] = [];
    const rowAssignments: { [key: number]: number } = {}; // Track end indexes of rows
    
    // Use a counter for rotating through colors
    let colorCounter = 0;
    
    sortedEvents.forEach(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      // Helper function to compare dates ignoring time
      const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
      };
      
      // Find the indexes in the calendarDays array
      let startIndex = -1;
      let endIndex = -1;
      
      for (let i = 0; i < calendarDays.length; i++) {
        if (isSameDay(calendarDays[i], startDate)) {
          startIndex = i;
        }
        if (isSameDay(calendarDays[i], endDate)) {
          endIndex = i;
          break;
        }
      }
      
      // Handle events that start before the calendar view
      if (startIndex === -1) {
        const firstCalendarDay = calendarDays[0];
        if (startDate < firstCalendarDay) {
          startIndex = 0;
        }
      }
      
      // Handle events that end after the calendar view
      if (endIndex === -1) {
        const lastCalendarDay = calendarDays[calendarDays.length - 1];
        if (endDate > lastCalendarDay) {
          endIndex = calendarDays.length - 1;
        }
      }
      
      // Skip events that don't fall in the current calendar view
      if (startIndex === -1 && endIndex === -1) {
        return;
      }

      // Handle events where start date is after the calendar view
      if (startIndex === -1) {
        const lastCalendarDay = calendarDays[calendarDays.length - 1];
        if (startDate > lastCalendarDay) {
          return;
        }
      }
      
      // Handle events where end date is before the calendar view
      if (endIndex === -1) {
        const firstCalendarDay = calendarDays[0];
        if (endDate < firstCalendarDay) {
          return;
        }
      }
      
      // Find a row for this event
      let rowAssigned = 0;
      while (
        rowAssignments[rowAssigned] !== undefined && 
        rowAssignments[rowAssigned] >= startIndex && 
        rowAssigned < MAX_EVENT_ROWS
      ) {
        rowAssigned++;
      }
      
      // Assign a color index and increment the counter
      const colorIndex = colorCounter % eventColorSchemes.length;
      colorCounter++;
      
      positions.push({
        event,
        row: rowAssigned,
        startIndex,
        endIndex,
        colorIndex
      });
      
      rowAssignments[rowAssigned] = endIndex;
    });
    
    setEventPositions(positions);
  }, [events, calendarDays]);

  // Go to previous month
  const goToPrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Go to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Format the month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if a date is in the current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Render a continuous event band with color
  const renderEventBand = (position: EventPosition) => {
    const { event, startIndex, endIndex, colorIndex } = position;
    const cellsPerRow = 7; // 7 days per week
    
    // Get color scheme for this event
    const colorScheme = eventColorSchemes[colorIndex];
    
    // Calculate the week start and end indices
    const startWeek = Math.floor(startIndex / cellsPerRow);
    const endWeek = Math.floor(endIndex / cellsPerRow);
    const cellWidth = 100 / cellsPerRow;
    
    // Reduced cell height
    const cellHeight = 95; // Reduced from 140 to make the calendar more compact
    
    // Generate the class name with the appropriate colors
    const eventClassBase = `absolute ${colorScheme.bg} ${colorScheme.bgDark} ${colorScheme.text} ${colorScheme.textDark} ${colorScheme.hoverBg} ${colorScheme.hoverBgDark} border ${colorScheme.border} ${colorScheme.borderDark} text-xs overflow-hidden whitespace-nowrap px-1 z-10`;
    
    // For single week events
    if (startWeek === endWeek) {
      return (
        <div
          key={`${event._id}-${startIndex}-${endIndex}`}
          className={`${eventClassBase} rounded`}
          style={{
            left: `calc(${(startIndex % cellsPerRow) * cellWidth}% + 2px)`,
            width: `calc(${((endIndex - startIndex) + 1) * cellWidth}% - 4px)`,
            top: `${startWeek * cellHeight + position.row * (16 + 2) + 22}px`, // Added 2px gap between rows
            height: '16px' // Slightly reduced from 18px
          }}
          title={event.name}
        >
          <Link 
            to={`/volunteer/register/${event._id}`}
            state={{ eventData: event }}
            className="block h-full w-full truncate"
          >
            {event.name}
          </Link>
        </div>
      );
    }
    
    // For multi-week events, we need to create separate spans for each week
    const elements = [];
    
    // First week (partial)
    elements.push(
      <div
        key={`${event._id}-${startWeek}`}
        className={`${eventClassBase} rounded-l`}
        style={{
          left: `calc(${(startIndex % cellsPerRow) * cellWidth}% + 2px)`,
          width: `calc(${(cellsPerRow - (startIndex % cellsPerRow)) * cellWidth}% - 4px)`,
          top: `${startWeek * cellHeight + position.row * (16 + 2) + 22}px`, // Added 2px gap
          height: '16px'
        }}
        title={event.name}
      >
        <Link 
          to={`/volunteer/register/${event._id}`}
          state={{ eventData: event }}
          className="block h-full w-full truncate"
        >
          {event.name}
        </Link>
      </div>
    );
    
    // Middle full weeks
    for (let week = startWeek + 1; week < endWeek; week++) {
      elements.push(
        <div
          key={`${event._id}-${week}`}
          className={eventClassBase}
          style={{
            left: '2px',
            width: 'calc(100% - 4px)',
            top: `${week * cellHeight + position.row * (16 + 2) + 22}px`, // Added 2px gap
            height: '16px'
          }}
          title={event.name}
        >
          <Link 
            to={`/volunteer/register/${event._id}`}
            state={{ eventData: event }}
            className="block h-full w-full truncate"
          >
            {event.name}
          </Link>
        </div>
      );
    }
    
    // Last week (partial)
    if (startWeek !== endWeek) {
      elements.push(
        <div
          key={`${event._id}-${endWeek}`}
          className={`${eventClassBase} rounded-r`}
          style={{
            left: '2px',
            width: `calc(${((endIndex % cellsPerRow) + 1) * cellWidth}% - 4px)`,
            top: `${endWeek * cellHeight + position.row * (16 + 2) + 22}px`, // Added 2px gap
            height: '16px'
          }}
          title={event.name}
        >
          <Link 
            to={`/volunteer/register/${event._id}`}
            state={{ eventData: event }}
            className="block h-full w-full truncate"
          >
            {event.name}
          </Link>
        </div>
      );
    }
    
    return elements;
  };

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="flex flex-row items-center justify-between py-1">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <CardTitle className="text-base">{t("event_calendar")}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("view_all_upcoming_events_in_a_calendar_format")}
        </CardDescription>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPrevMonth}
            aria-label={t("previous_month")}
            className="text-xs py-1 h-7"
          >
            {t("previous_month")}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextMonth}
            aria-label={t("next_month")}
            className="text-xs py-1 h-7"
          >
            {t("next_month")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-1">
          <h3 className="text-center font-bold text-lg mb-2">
            {formatMonthYear(currentDate)}
          </h3>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium py-1 text-xs text-gray-600 dark:text-gray-300">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          <div className="col-span-7 grid grid-cols-7 gap-px relative">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`min-h-20 border p-1 ${
                  isToday(day) 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
                    : isCurrentMonth(day)
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500'
                }`}
              >
                <div className="text-right text-xs font-medium mb-1">
                  {day.getDate()}
                </div>
                {/* Space for events (empty - actual events rendered separately) */}
                <div className="h-16"></div> {/* Reduced from h-24 */}
              </div>
            ))}
            
            {/* Render all continuous event bands */}
            {eventPositions.map(position => renderEventBand(position))}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
          <p>{t("click_on_any_event_to_register")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendarComponent;