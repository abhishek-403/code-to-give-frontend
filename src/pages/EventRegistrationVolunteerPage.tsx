import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Availabitity } from "@/lib/constants/server-constants";
import { cn } from "@/lib/utils";
import { useSubmitApplicationMutation } from "@/services/event";
import { RootState } from "@/store";
import { formatDateFromDate } from "@/utils/formattedDate";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  phone: string;
  availabilityOption: Availabitity;
  volunteeringDomains: any;
  startDate: Date;
  endDate: Date;
  comments?: string;
  templateResponses?: Record<string, string>;
}

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
  template: { fields?: { label: string }[] };
}

const EventRegistrationVolunteerPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((s: RootState) => s.user);
  const eventData = location.state?.eventData as EventType | undefined;
  // used to enable tab keys functioing over calendars
  const endDateButtonRef = useRef<HTMLButtonElement>(null);
  const commentsRef = useRef<HTMLTextAreaElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: user.displayName || "",
      email: user.email || "",
      phone: "",
      availabilityOption: Availabitity.WEEKDAYS,
      comments: "",
    },
  });

  const {
    mutate: submitApplication,
    isPending,
    isSuccess,
  } = useSubmitApplicationMutation();

  useEffect(() => {
    if (eventData) {
      if (eventData.template?.fields) {
        const updatedTemplateResponses: Record<string, string> = ({} = {});
        eventData.template.fields.forEach((field) => {
          updatedTemplateResponses[field.label] = "";
        });
        setValue("templateResponses", updatedTemplateResponses);
      }
      setValue("startDate", eventData.startDate);
      setValue("endDate", eventData.endDate);

      // if (eventData.availability) {
      //   if (eventData.availability === "Weekdays") {
      //     setValue("availabilityOption", "weekdays");
      //   } else if (eventData.availability === "Weekends") {
      //     setValue("availabilityOption", "weekends");
      //   } else if (eventData.availability === "Both") {
      //     setValue("availabilityOption", "both");
      //   }
      // }
    }
  }, [eventData, setValue]);

  const startDate = watch("startDate");

  const onSubmit = async (data: FormData) => {
    // later we will send this data to the server !!!!!!!!!!!!

    submitApplication({
      eventId,
      applicantPhone: data.phone,
      applicantEmail: data.email,
      applicantName: data.name,
      volunteeringDomain: data.volunteeringDomains,
      willingStartDate: data.startDate,
      willingEndDate: data.endDate,
      availability: data.availabilityOption,
      notes: data.comments,
      templateResponses: data.templateResponses,
    });
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date && endDateButtonRef.current) {
      setTimeout(() => {
        endDateButtonRef.current?.focus();
      }, 100);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current?.focus();
      }, 100);
    }
  };

  if (!eventData && eventId) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Event Not Found</h1>
        <p className="mb-6 text-gray-600">
          We couldn't find information for the event you selected. Please go
          back and try again.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Button>
      </div>
    );
  }
  if (!eventData) {
    return <div>Loading..</div>;
  }
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-primary-600">
          <Button variant="outline" className="mb-4">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>

        {eventData && (
          <div className="mb-4">
            <h1 className="text-3xl font-bold" id="form-title">
              Volunteer Registration: {eventData.name}
            </h1>
            <p className="mt-2 text-gray-600">{eventData.description}</p>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-medium">Location:</span>{" "}
              {eventData.location} •
              {/* <span className="font-medium ml-2">Domain:</span>{" "}
              {eventData.volunteeringDomains[0].name} • */}
              <span className="font-medium ml-2">Dates:</span>{" "}
              {formatDateFromDate(eventData.startDate)} to{" "}
              {formatDateFromDate(eventData.endDate)}
            </p>
          </div>
        )}

        <p className="text-gray-600">
          Fill out the form below to register as a volunteer for this event.
          Required fields are marked with an asterisk (*).
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
        aria-labelledby="form-title"
      >
        {/* Personal Information Section */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">
            Personal Information
          </legend>

          {/* Full Name */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </Label>
              {errors.name && (
                <p
                  className="text-sm text-red-500"
                  id="name-error"
                  aria-live="assertive"
                >
                  {errors.name?.message?.toString()}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500" id="name-description">
              Please enter your first and last name
            </p>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  aria-describedby="name-description name-error"
                  aria-invalid={!!errors.name}
                  aria-required={true}
                  className={cn(errors.name && "border-red-500")}
                  {...field}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="name" className="text-sm font-medium">
                Volunteering Domain{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </Label>
              {errors.name && (
                <p
                  className="text-sm text-red-500"
                  id="name-error"
                  aria-live="assertive"
                >
                  {errors.name?.message?.toString()}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1" id="volunteering-domains">
              Select your Volunteering Domain
            </p>
            {/* <Controller
              name="volunteeringDomains"
              control={control}
              rules={{ required: "At least one skill is required" }}
              render={({ field }) => (
                <MultiSelect
                  options={eventData.volunteeringDomains.map((event) => ({
                    value: event._id,
                    label: event.name,
                  }))}
                  onValueChange={(selected) => {
                    field.onChange(selected);
                    setValue("volunteeringDomains", selected);
                  }}
                  value={field.value}
                  placeholder="Select Dominas"
                  variant="default"
                  animation={1}
                  maxCount={3}
                  className={cn(errors.volunteeringDomains && "border-red-500")}
                />
              )}
            /> */}
            <Controller
              name="volunteeringDomains"
              control={control}
              rules={{ required: "At least one domain is required" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(selected) => {
                    field.onChange(selected);
                    setValue("volunteeringDomains", selected);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      errors.volunteeringDomains && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventData.volunteeringDomains.map((event) => (
                      <SelectItem key={event._id} value={event._id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Rest of the form remains the same */}
          {/* ... */}

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="email" className="text-sm font-medium">
                Email{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </Label>
              {errors.email && (
                <p
                  className="text-sm text-red-500"
                  id="email-error"
                  aria-live="assertive"
                >
                  {errors.email?.message?.toString()}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500" id="email-description">
              We will use this to contact you about volunteer opportunities
            </p>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  aria-describedby="email-description email-error"
                  aria-invalid={!!errors.email}
                  aria-required={true}
                  className={cn(errors.email && "border-red-500")}
                  {...field}
                />
              )}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </Label>
              {errors.phone && (
                <p
                  className="text-sm text-red-500"
                  id="phone-error"
                  aria-live="assertive"
                >
                  {errors.phone?.message?.toString()}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500" id="phone-description">
              Enter a 10-digit phone number without spaces or dashes
            </p>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Must be a valid 10-digit phone number",
                },
              }}
              render={({ field }) => (
                <Input
                  type="tel"
                  id="phone"
                  placeholder="1234567890"
                  aria-describedby="phone-description phone-error"
                  aria-invalid={!!errors.phone}
                  aria-required={true}
                  className={cn(errors.phone && "border-red-500")}
                  {...field}
                />
              )}
            />
          </div>
        </fieldset>

        {/* Availability Section */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">Availability</legend>

          {/* Availability Options */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label
                id="availability-group-label"
                className="text-sm font-medium"
              >
                When are you available?{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </Label>
              {errors.availabilityOption && (
                <p
                  className="text-sm text-red-500"
                  id="availability-error"
                  aria-live="assertive"
                >
                  {errors.availabilityOption?.message?.toString()}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500" id="availability-description">
              Select when you are generally available to volunteer
            </p>
            <Controller
              name="availabilityOption"
              control={control}
              rules={{ required: "Please select your availability" }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                  aria-describedby="availability-description availability-error"
                  aria-labelledby="availability-group-label"
                  aria-invalid={!!errors.availabilityOption}
                >
                  {
                    eventData.availability.map((avail) => (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={avail} id={avail} />
                        <Label htmlFor={avail} className="font-normal">
                          {avail}
                        </Label>
                      </div>
                    ))
                    // <div className="flex items-center space-x-2">
                    //   <RadioGroupItem value="weekends" id="weekends" />
                    //   <Label htmlFor="weekends" className="font-normal">
                    //     Weekends (Saturday-Sunday)
                    //   </Label>
                    // </div>
                    // <div className="flex items-center space-x-2">
                    //   <RadioGroupItem value="both" id="both" />
                    //   <Label htmlFor="both" className="font-normal">
                    //     Both Weekdays and Weekends
                    //   </Label>
                    // </div>
                  }
                </RadioGroup>
              )}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="startDate" className="text-sm font-medium">
                  Start Date{" "}
                  <span className="text-red-500" aria-hidden="true">
                    *
                  </span>
                </Label>
                {errors.startDate && (
                  <p
                    className="text-sm text-red-500"
                    id="startDate-error"
                    aria-live="assertive"
                  >
                    {errors.startDate?.message?.toString()}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500" id="startDate-description">
                When can you start volunteering?
              </p>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.startDate && "border-red-500"
                        )}
                        aria-describedby="startDate-description startDate-error"
                        aria-invalid={!!errors.startDate}
                        aria-haspopup="dialog"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          handleStartDateSelect(date);
                        }}
                        disabled={(date) =>
                          date <= new Date(eventData.startDate) ||
                          date >= new Date(eventData.endDate)
                        }
                        toDate={new Date(eventData.endDate)}
                        defaultMonth={new Date(eventData.startDate)}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="endDate" className="text-sm font-medium">
                  End Date{" "}
                  <span className="text-red-500" aria-hidden="true">
                    *
                  </span>
                </Label>
                {errors.endDate && (
                  <p
                    className="text-sm text-red-500"
                    id="endDate-error"
                    aria-live="assertive"
                  >
                    {errors.endDate?.message?.toString()}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500" id="endDate-description">
                Until when can you volunteer?
              </p>
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: "End date is required",
                  validate: (value) =>
                    !startDate ||
                    !value ||
                    value > startDate ||
                    "End date must be after start date",
                }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        ref={endDateButtonRef}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.endDate && "border-red-500"
                        )}
                        aria-describedby="endDate-description endDate-error"
                        aria-invalid={!!errors.endDate}
                        aria-haspopup="dialog"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          handleEndDateSelect(date);
                        }}
                        // disabled={(date) =>
                        //   date < new Date() ||
                        //   (startDate ? date < startDate : false) ||
                        //   (eventData ? date > eventData.endDate : false)
                        // }
                        fromDate={startDate || new Date(eventData.startDate)}
                        toDate={new Date(eventData.endDate)}
                        defaultMonth={
                          startDate || new Date(eventData.startDate)
                        }
                        disabled={(date) =>
                          date < (startDate || new Date(eventData.startDate)) ||
                          date > new Date(eventData.endDate)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>
        </fieldset>
        {eventData.template?.fields && (
          <fieldset className="space-y-4 border border-gray-200 rounded p-4">
            <legend className="text-xl font-semibold px-2">
              Required Fields
            </legend>

            {eventData.template?.fields?.map((field: any) => (
              <div key={field._id} className="space-y-2">
                <Label htmlFor={field._id}>{field.label}</Label>
                <Controller
                  name={field.label}
                  control={control}
                  rules={{
                    required: field.required ? `Required field` : false,
                  }}
                  render={({ field: inputField }) => (
                    <Input
                      id={field._id}
                      placeholder={field.placeholder}
                      {...inputField}
                    />
                  )}
                />
                {errors.templateResponses?.[field.label] && (
                  <p
                    className="text-sm text-red-500"
                    id={`${field.label}-error`}
                    aria-live="assertive"
                  >
                    {errors.templateResponses?.[
                      field.label
                    ]?.message?.toString()}
                  </p>
                )}
              </div>
            ))}
          </fieldset>
        )}
        {/* Additional Information */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">
            Additional Information
          </legend>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Additional Comments
            </Label>
            <p className="text-xs text-gray-500" id="comments-description">
              Share any skills, preferences, or other information that might be
              helpful
            </p>
            <Controller
              name="comments"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="comments"
                  placeholder="Tell us about any special skills, interests, or questions..."
                  aria-describedby="comments-description"
                  className="min-h-24"
                  {...field}
                  ref={(e) => {
                    field.ref(e);
                    commentsRef.current = e;
                  }}
                />
              )}
            />
          </div>
        </fieldset>

        <div className="space-y-2">
          <Button
            type="submit"
            className={cn(
              "w-full md:w-auto",
              isSuccess && "bg-green-700 hover:bg-green-700"
            )}
            disabled={isSubmitting || isPending}
            aria-disabled={isSubmitting}
          >
            {isSubmitting || isPending
              ? "Submitting..."
              : isSuccess
              ? "You have applied!!"
              : "Register as Volunteer"}
          </Button>

          {/* Add help text for required fields */}
          <p className="text-xs text-gray-500" aria-hidden="true">
            <span className="text-red-500">*</span> indicates required fields
          </p>
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationVolunteerPage;
