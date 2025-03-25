import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MultiSelect } from "@/components/ui/mulit-select";
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
import { Availabitity } from "@/lib/constants/server-constants";
import useLanguage from "@/lib/hooks/useLang";
import { cn } from "@/lib/utils";
import {
  useCreateEventMutation,
  useCreateNewVolunteeringDomainMutation,
  useGetEventTemplates,
} from "@/services/event";
import { useAppSelector } from "@/store";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  LayoutTemplate,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link } from "react-router";


// Define types for our form
type FormFieldType = {
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
};

type EventFormValues = {
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  volunteeringDomains: string[];
  capacity: number;
  availability: string[];
  formFields: FormFieldType[];
  saveFormFieldsAsTemplate?: boolean;
};

type FormTemplate = {
  id: string;
  name: string;
  fields: FormFieldType[];
};

const EventCreationPage = () => {
  // const [templates, setTemplates] = useState<FormTemplate[]>([
  //   {
  //     id: "1",
  //     name: "Basic Volunteer Info",
  //     category: "general",
  //     formFields: [
  //       {
  //         label: "Full Name",
  //         type: "text",
  //         required: true,
  //         placeholder: "Enter your full name",
  //       },
  //       {
  //         label: "Email",
  //         type: "email",
  //         required: true,
  //         placeholder: "Enter your email address",
  //       },
  //       {
  //         label: "Phone Number",
  //         type: "phone",
  //         required: true,
  //         placeholder: "Enter your phone number",
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     name: "Education Program",
  //     category: "education",
  //     formFields: [
  //       {
  //         label: "Full Name",
  //         type: "text",
  //         required: true,
  //         placeholder: "Enter your full name",
  //       },
  //       {
  //         label: "Email",
  //         type: "email",
  //         required: true,
  //         placeholder: "Enter your email address",
  //       },
  //       {
  //         label: "Teaching Experience",
  //         type: "textarea",
  //         required: false,
  //         placeholder: "Describe your teaching experience",
  //       },
  //       {
  //         label: "Preferred Age Group",
  //         type: "select",
  //         required: true,
  //         placeholder: "Select age group",
  //       },
  //     ],
  //   },
  // ]);

  const { mutate, isPending } = useCreateEventMutation();
  const [showNewDomainDialog, setShowNewDomainDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [newDomainName, setNewDomainName] = useState("");
  const [showLoadTemplateDialog, setShowLoadTemplateDialog] = useState(false);
  const { data: templates, isLoading } = useGetEventTemplates();

  const form = useForm<EventFormValues>({
    defaultValues: {
      name: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      volunteeringDomains: [],
      capacity: 0,
      availability: [Availabitity.BOTH],
      formFields: [],
      saveFormFieldsAsTemplate: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const { t } = useLanguage()

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "formFields",
  });

  const onSubmit = (data: EventFormValues) => {
    // Transform data to match schema
    if (data.saveFormFieldsAsTemplate && !templateName.trim()) {
      setTemplateNameError("Template name required");
      return;
    }
    const transformedData = {
      name: data.name,
      description: data.description,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      volunteeringDomains: Array.isArray(data.volunteeringDomains)
        ? data.volunteeringDomains
        : [data.volunteeringDomains],
      availability: data.availability,
      formFields: data.formFields,
      capacity: data.capacity,
      saveAsTemplate: data.saveFormFieldsAsTemplate,
      templateName,
    };
    mutate(transformedData);
  };

  const addNewField = () => {
    append({
      label: "",
      type: "text",
      required: false,
      placeholder: "",
    });
  };

  const { mutate: createDomain } = useCreateNewVolunteeringDomainMutation();

  const [templateNameError, setTemplateNameError] = useState<string | null>(
    null
  );

  // Function to load a template's form fields
  const loadTemplate = (temp: FormTemplate) => {
    replace(temp.fields);

    setShowLoadTemplateDialog(false);
  };
  const volDomains: any = useAppSelector(
    (state: any) => state.eventDetails.voluneeringDomain
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link to="/admin" className="text-primary-600">
        <Button variant="outline" className="mb-4">
          <ArrowLeft size={16} />{t("back_to_dashboard")}</Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">{t("create_event")}</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("event_details")}</CardTitle>
              <CardDescription>{t("basic_information_about_your_event")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Name (formerly Title) */}
              <FormField
                control={control}
                name="name"
                rules={{ required: "Event name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">{t("event_name")}</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Enter event name"
                        aria-describedby="name-error"
                        {...field}
                      />
                    </FormControl>
                    {errors.name && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.name.message}
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
                    <FormLabel htmlFor="description">{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Describe your event"
                        rows={4}
                        aria-describedby="description-error"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("provide_details_about_your_event_to_attract_volunteers_")}</FormDescription>
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
                    <FormLabel htmlFor="location">{t("location")}</FormLabel>
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
                    <FormLabel htmlFor="startDate">{t("start_date")}</FormLabel>
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
                              <span>{t("pick_a_date")}</span>
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
                    <FormLabel htmlFor="endDate">{t("end_date")}</FormLabel>
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
                              <span>{t("pick_a_date")}</span>
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

              {/* Volunteering Domains (formerly Category) */}
              {/* <FormField
                control={control}
                name="volunteeringDomains"
                rules={{ required: "Volunteering domain is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="volunteeringDomains">
                      Volunteering Domain
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange([value])} // Store as array for schema compatibility
                      value={field.value?.length ? field.value[0] : ""}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="volunteeringDomains"
                          aria-describedby="volunteeringDomains-error"
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
                    {errors.volunteeringDomains && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.volunteeringDomains.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              /> */}
              <FormField
                control={control}
                name="volunteeringDomains"
                rules={{ required: "Volunteering domain is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="volunteeringDomains">{t("volunteering_domains")}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={volDomains ?? []}
                        onValueChange={field.onChange}
                        defaultValue={field.value || []}
                        placeholder="Select volunteering domains"
                        maxCount={3}
                        className="w-full text-gray-500 dark:text-gray-400 dark:bg-gray"
                        id="volunteeringDomains"
                        aria-describedby="volunteeringDomains-error"
                      />
                    </FormControl>
                    {errors.volunteeringDomains && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.volunteeringDomains.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <div>
                <Dialog
                  open={showNewDomainDialog}
                  onOpenChange={setShowNewDomainDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <BookMarked size={16} />{t("add_new_domain")}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("volunteering_domain")}</DialogTitle>
                      <DialogDescription>{t("add_a_new_volunteering_domain_")}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <FormItem>
                        <FormLabel htmlFor="newdomainName">{t("volunteering_domain_name_")}</FormLabel>
                        <Input
                          id="newdomainName"
                          placeholder="Enter a name for this domain"
                          value={newDomainName}
                          required
                          onChange={(e) => setNewDomainName(e.target.value)}
                        />
                      </FormItem>
                      {/* <FormItem>
                        <FormLabel htmlFor="newdomainDesc">
                          Volunteering Domain description :
                        </FormLabel>
                        <Input
                          id="newdomainDesc"
                          placeholder="Enter a description for domain"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                      </FormItem> */}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewDomainDialog(false)}
                      >{t("cancel")}</Button>
                      <Button
                        onClick={() => {
                          createDomain(
                            { name: newDomainName },
                            {
                              onSuccess: () => setShowNewDomainDialog(false),
                            }
                          );
                        }}
                        disabled={!newDomainName.trim()}
                      >{t("save")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Availability - New field based on schema */}
              {/* <FormField
                control={control}
                name="availability"
                rules={{ required: "Availability is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="availability">Availability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="availability"
                          aria-describedby="availability-error"
                        >
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Availabitity.WEEKENDS}>
                          Weekends
                        </SelectItem>
                        <SelectItem value={Availabitity.WEEKDAYS}>
                          Weekdays
                        </SelectItem>
                        <SelectItem value={Availabitity.BOTH}>Both</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.availability && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.availability.message}
                        </span>
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              /> */}

              <FormField
                control={control}
                name="availability"
                rules={{ required: "Availability is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="availability">{t("availability")}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { label: "Week ends", value: Availabitity.WEEKENDS },
                          { label: "Week days", value: Availabitity.WEEKDAYS },
                          { label: "Both", value: Availabitity.BOTH },
                        ]}
                        onValueChange={field.onChange}
                        // defaultValue={field.value || []}
                        
                        defaultValue={
                          Array.isArray(field.value)
                            ? field.value
                            : field.value
                            ? [field.value]
                            : []
                        }
                        placeholder="Select availability"
                        maxCount={3}
                        className="w-full text-gray-500 dark:text-gray-400 dark:bg-gray"
                        id="availability"
                        aria-describedby="availability-error"
                      />
                    </FormControl>
                    {errors.availability && (
                      <FormMessage>
                        <span className="flex items-center gap-2 text-red-500">
                          <AlertCircle size={16} />
                          {errors.availability.message}
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
                    <FormLabel htmlFor="capacity">{t("volunteer_capacity")}</FormLabel>
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
                    <FormDescription>{t(
                      "note_capacity_will_be_stored_separately_as_it_s_not_part_of_the_main_event_schema_"
                    )}</FormDescription>
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
                <CardTitle>{t("volunteer_registration_form_fields")}</CardTitle>
                <CardDescription>{t("define_the_fields_volunteers_must_fill_out_to_register_for_this_event_")}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={showLoadTemplateDialog}
                  onOpenChange={setShowLoadTemplateDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <LayoutTemplate size={16} />{t("load_template")}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("load_form_template")}</DialogTitle>
                      <DialogDescription>{t("select_a_template_to_load_predefined_form_fields_")}</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto">
                      {isLoading ? (
                        <div>{t("loading")}</div>
                      ) : templates && templates.length === 0 ? (
                        <p className="text-center py-4">{t("no_templates_found_")}</p>
                      ) : (
                        <div className="space-y-4 mt-4">
                          {templates &&
                            templates.map(
                              (template: FormTemplate, index: any) => {
                                return (
                                  <div
                                    key={index}
                                    className={`border rounded-md p-4 cursor-pointer transition hover:border-primary`}
                                    onClick={() => loadTemplate(template)}
                                  >
                                    <div className="flex justify-between items-center">
                                      <h3 className="font-medium">
                                        {template.name}
                                      </h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                      {template.fields.length}{t("field_s_")}</p>
                                  </div>
                                );
                              }
                            )}
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowLoadTemplateDialog(false)}
                      >{t("cancel")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-md mb-4">
                  <p className="text-gray-500">{t(
                    "no_form_fields_added_yet_click_add_field_to_create_your_first_form_field_or_load_a_template_"
                  )}</p>
                </div>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-md p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">{t("field_")}{index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      aria-label={`Remove field ${index + 1}`}
                    >{t("remove")}</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Field Label */}
                    <FormField
                      control={control}
                      name={`formFields.${index}.label`}
                      rules={{ required: "Label is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor={`formFields.${index}.label`}>{t("field_label")}</FormLabel>
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
                          <FormLabel htmlFor={`formFields.${index}.type`}>{t("field_type")}</FormLabel>
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
                              {["Text"].map((v) => (
                                <SelectItem value={v} key={v}>
                                  {v}
                                </SelectItem>
                              ))}
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
                          >{t("placeholder_text")}</FormLabel>
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
                          <FormLabel htmlFor={`formFields.${index}.required`}>{t("required_field")}</FormLabel>
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
              {fields.length > 0 && (
                // <Dialog
                //   open={showSaveTemplateDialog}
                //   onOpenChange={setShowSaveTemplateDialog}
                // >
                //   <DialogTrigger asChild>
                //     <Button
                //       type="button"
                //       variant="outline"
                //       className="flex items-center gap-2"
                //     >
                //       <BookMarked size={16} />
                //       Save as Template
                //     </Button>
                //   </DialogTrigger>
                //   <DialogContent>
                //     <DialogHeader>
                //       <DialogTitle>Save as Template</DialogTitle>
                //       <DialogDescription>
                //         Save this form configuration as a template for future
                //         events.
                //       </DialogDescription>
                //     </DialogHeader>
                //     <div className="py-4">
                //       <FormItem>
                //         <FormLabel htmlFor="templateName">
                //           Template Name
                //         </FormLabel>
                //         <Input
                //           id="templateName"
                //           placeholder="Enter a name for this template"
                //           value={templateName}
                //           onChange={(e) => setTemplateName(e.target.value)}
                //         />
                //         <FormDescription>
                //           Choose a descriptive name that helps you identify
                //           this template
                //         </FormDescription>
                //       </FormItem>
                //     </div>
                //     <DialogFooter>
                //       <Button
                //         variant="outline"
                //         onClick={() => setShowSaveTemplateDialog(false)}
                //       >
                //         Cancel
                //       </Button>
                //       <Button
                //         onClick={saveAsTemplate}
                //         disabled={!templateName.trim()}
                //       >
                //         Save Template
                //       </Button>
                //     </DialogFooter>
                //   </DialogContent>
                // </Dialog>
                (<>
                  <FormField
                    control={control}
                    name="saveFormFieldsAsTemplate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row  space-x-3 space-y-0 rounded-md p-2">
                        <div className="flex gap-2  md:flex-row flex-col ">
                          <div className="flex items-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="saveAsTemplate"
                              />
                            </FormControl>
                            <div className="space-y-1 ml-2 md:min-w-[120px] center flex items-center leading-none">
                              <FormLabel htmlFor="saveAsTemplate">{t("save_as_template")}</FormLabel>
                            </div>
                          </div>
                          <div>
                            {field.value && (
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter template name"
                                  value={templateName}
                                  onChange={(e) =>
                                    setTemplateName(e.target.value)
                                  }
                                />
                              </FormControl>
                            )}
                          </div>
                          {templateNameError && (
                            <div className="text-red-500 text-sm ">
                              {templateNameError}
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* <Input type="text" placeholder="Template Name" /> */}
                </>)
              )}

              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewField}
                  className="flex-1"
                >{t("add_field")}</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link to="/admin">
              <Button variant="outline">{t("cancel")}</Button>
            </Link>
            <Button disabled={isPending} type="submit">{t("create_event")}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventCreationPage;
