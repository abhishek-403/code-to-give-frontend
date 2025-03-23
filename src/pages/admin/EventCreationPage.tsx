import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link } from "react-router";

// Define types for our form
type FormField = {
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
};

type EventFormValues = {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  category: string;
  capacity: number;
  formFields: FormField[];
};

const EventCreationPage = () => {
  // Initialize with default values

  const form = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      category: "",
      capacity: 0,
      formFields: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formFields",
  });

  const onSubmit = (data: EventFormValues) => {
    console.log(data);
    // Send data to backend API
  };

  // Function to add a new form field with default values
  const addNewField = () => {
    append({
      label: "",
      type: "text",
      required: false,
      placeholder: "",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Basic information about your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Title */}
              <FormField
                control={control}
                name="title"
                rules={{ required: "Event title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title">Event Title</FormLabel>
                    <FormControl>
                      <Input
                        id="title"
                        placeholder="Enter event title"
                        aria-describedby="title-error"
                        {...field}
                      />
                    </FormControl>
                    {errors.title && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.title.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Describe your event"
                        rows={4}
                        aria-describedby="description-error"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about your event to attract volunteers.
                    </FormDescription>
                    {errors.description && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.description.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={control}
                name="location"
                rules={{ required: "Location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="location">Location</FormLabel>
                    <FormControl>
                      <Input
                        id="location"
                        placeholder="Event location"
                        aria-describedby="location-error"
                        {...field}
                      />
                    </FormControl>
                    {errors.location && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.location.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={control}
                name="startDate"
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            id="startDate"
                            aria-describedby="startDate-error"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.startDate.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={control}
                name="endDate"
                rules={{
                  required: "End date is required",
                  validate: (value, formValues) =>
                    value >= formValues.startDate ||
                    "End date must be after start date",
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="endDate">End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            id="endDate"
                            aria-describedby="endDate-error"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.endDate && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.endDate.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={control}
                name="category"
                rules={{ required: "Domain is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="category">Event Domain</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="category"
                          aria-describedby="category-error"
                        >
                          <SelectValue placeholder="Select a domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="donation">
                          Donation Drives
                        </SelectItem>
                        <SelectItem value="community">
                          Community Support
                        </SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="rehabilitation">
                          Rehabilitation
                        </SelectItem>
                        <SelectItem value="environment">
                          Environmental
                        </SelectItem>
                        <SelectItem value="health">
                          Health & Wellness
                        </SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                        <SelectItem value="animals">Animal Welfare</SelectItem>
                        <SelectItem value="crisis">Crisis Response</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.category.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Capacity */}
              <FormField
                control={control}
                name="capacity"
                rules={{
                  required: "Capacity is required",
                  min: { value: 1, message: "Capacity must be at least 1" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="capacity">Volunteer Capacity</FormLabel>
                    <FormControl>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="Maximum number of volunteers"
                        min={1}
                        aria-describedby="capacity-error"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    {errors.capacity && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.capacity.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Registration Form Fields Section */}
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Registration Form Fields</CardTitle>
              <CardDescription>
                Define the fields volunteers must fill out to register for this
                event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fields.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-md mb-4">
                  <p className="text-gray-500">
                    No form fields added yet. Click "Add Field" to create your
                    first form field.
                  </p>
                </div>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-md p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Field #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      aria-label={`Remove field ${index + 1}`}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Field Label */}
                    <FormField
                      control={control}
                      name={`formFields.${index}.label`}
                      rules={{ required: "Label is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor={`formFields.${index}.label`}>
                            Field Label
                          </FormLabel>
                          <FormControl>
                            <Input
                              id={`formFields.${index}.label`}
                              placeholder="e.g., Full Name"
                              {...field}
                            />
                          </FormControl>
                          {errors.formFields?.[index]?.label && (
                            <FormMessage>
                              {errors.formFields[index]?.label?.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Field Type */}
                    <FormField
                      control={control}
                      name={`formFields.${index}.type`}
                      rules={{ required: "Type is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor={`formFields.${index}.type`}>
                            Field Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger id={`formFields.${index}.type`}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.formFields?.[index]?.type && (
                            <FormMessage>
                              {String(errors.formFields[index]?.type)}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Placeholder */}
                    <FormField
                      control={control}
                      name={`formFields.${index}.placeholder`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor={`formFields.${index}.placeholder`}
                          >
                            Placeholder Text
                          </FormLabel>
                          <FormControl>
                            <Input
                              id={`formFields.${index}.placeholder`}
                              placeholder="e.g., Enter your full name"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Required Field Toggle */}
                    <FormField
                      control={control}
                      name={`formFields.${index}.required`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between mt-8 space-x-2 space-y-0">
                          <FormLabel htmlFor={`formFields.${index}.required`}>
                            Required Field
                          </FormLabel>
                          <FormControl>
                            <Switch
                              id={`formFields.${index}.required`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addNewField}
                className="w-full mt-2"
              >
                Add Field
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link to="/admin">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventCreationPage;
