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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { AlertCircle, ArrowLeft, BookMarked, LayoutTemplate } from "lucide-react";
import { useState } from "react";
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

type FormTemplate = {
  id: string;
  name: string;
  category: string;
  formFields: FormField[];
};

const EventCreationPage = () => {
  // Mock templates - this would come from API in the real implementation
  const [templates, setTemplates] = useState<FormTemplate[]>([
    {
      id: "1",
      name: "Basic Volunteer Info",
      category: "general",
      formFields: [
        {
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name",
        },
        {
          label: "Email",
          type: "email",
          required: true,
          placeholder: "Enter your email address",
        },
        {
          label: "Phone Number",
          type: "phone",
          required: true,
          placeholder: "Enter your phone number",
        },
      ],
    },
    {
      id: "2",
      name: "Education Program",
      category: "education",
      formFields: [
        {
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name",
        },
        {
          label: "Email",
          type: "email",
          required: true,
          placeholder: "Enter your email address",
        },
        {
          label: "Teaching Experience",
          type: "textarea",
          required: false,
          placeholder: "Describe your teaching experience",
        },
        {
          label: "Preferred Age Group",
          type: "select",
          required: true,
          placeholder: "Select age group",
        },
      ],
    },
  ]);

  // States for template management
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showLoadTemplateDialog, setShowLoadTemplateDialog] = useState(false);

  // Initialize form with default values
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
    getValues,
    setValue,
    watch,
  } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "formFields",
  });

  const watchCategory = watch("category");

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

  // Function to save current form fields as a template
  const saveAsTemplate = () => {
    const formFields = getValues("formFields");
    const category = getValues("category");
    
    if (formFields.length === 0) {
      alert("Please add at least one form field to save as template");
      return;
    }

    // This would be an API call in the real implementation
    const newTemplate: FormTemplate = {
      id: Date.now().toString(), // temporary ID generation
      name: templateName,
      category: category,
      formFields: formFields,
    };

    setTemplates([...templates, newTemplate]);
    setShowSaveTemplateDialog(false);
    setTemplateName("");
    
    // In a real implementation, this would be:
    // const response = await fetch('/api/templates', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: templateName, category, formFields })
    // });
    // if (response.ok) {
    //   // Show success message
    // }
  };

  // Function to load a template's form fields
  const loadTemplate = (template: FormTemplate) => {
    replace(template.formFields);
    
    // If the template is specific to a category, set that category
    if (template.category && template.category !== "general") {
      setValue("category", template.category);
    }
    
    setShowLoadTemplateDialog(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link to="/admin" className="text-primary-600">
        <Button variant="outline" className="mb-4">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </Link>
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
                      value={field.value}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Volunteer Registration Form Fields</CardTitle>
                <CardDescription>
                  Define the fields volunteers must fill out to register for this
                  event.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={showLoadTemplateDialog} onOpenChange={setShowLoadTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <LayoutTemplate size={16} />
                      Load Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Load Form Template</DialogTitle>
                      <DialogDescription>
                        Select a template to load predefined form fields.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto">
                      {templates.length === 0 ? (
                        <p className="text-center py-4">No templates found.</p>
                      ) : (
                        <div className="space-y-4 mt-4">
                          {templates.map((template) => {
                            const isMatchingCategory = !watchCategory || 
                              watchCategory === template.category || 
                              template.category === "general";
                            
                            return (
                              <div 
                                key={template.id} 
                                className={`border rounded-md p-4 cursor-pointer transition hover:border-primary ${
                                  !isMatchingCategory ? "opacity-50" : ""
                                }`}
                                onClick={() => isMatchingCategory && loadTemplate(template)}
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">{template.name}</h3>
                                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                    {template.category === "general" 
                                      ? "All Domains" 
                                      : template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                  {template.formFields.length} field(s)
                                </p>
                                {!isMatchingCategory && watchCategory && (
                                  <p className="text-xs text-amber-600 mt-2">
                                    This template is for a different domain than currently selected.
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowLoadTemplateDialog(false)}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-md mb-4">
                  <p className="text-gray-500">
                    No form fields added yet. Click "Add Field" to create your
                    first form field, or load a template.
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
                            value={field.value}
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

              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewField}
                  className="flex-1"
                >
                  Add Field
                </Button>
                
                {fields.length > 0 && (
                  <Dialog open={showSaveTemplateDialog} onOpenChange={setShowSaveTemplateDialog}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="flex items-center gap-2">
                        <BookMarked size={16} />
                        Save as Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save as Template</DialogTitle>
                        <DialogDescription>
                          Save this form configuration as a template for future events.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <FormItem>
                          <FormLabel htmlFor="templateName">Template Name</FormLabel>
                          <Input 
                            id="templateName"
                            placeholder="Enter a name for this template"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                          />
                          <FormDescription>
                            Choose a descriptive name that helps you identify this template
                          </FormDescription>
                        </FormItem>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveTemplateDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={saveAsTemplate} 
                          disabled={!templateName.trim()}
                        >
                          Save Template
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
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
