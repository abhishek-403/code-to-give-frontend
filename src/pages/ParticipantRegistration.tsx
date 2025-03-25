import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import useLanguage from "@/lib/hooks/useLang";

interface ParticipantRegistrationFormData {
  name: string;
  email: string;
  phone: string;
  event: string;
  message?: string;
}

const ParticipantRegistrationForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParticipantRegistrationFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      event: "",
      message: "",
    },
  });

  const onSubmit = (data: ParticipantRegistrationFormData) => {
    alert(`Thank you for registering for the event: ${data.event}!`);
  };
  const { t } = useLanguage()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-primary-600">
          <Button variant="outline" className="mb-4">
            <ArrowLeft size={16} />{t("back_to_home")}</Button>
        </Link>

        <h1 className="text-3xl font-bold mb-4">{t("participant_registration")}</h1>
        <p className="text-gray-600">{t(
          "fill_out_the_form_below_to_register_as_a_participant_for_this_event_required_fields_are_marked_with_an_asterisk_"
        )}</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
        aria-labelledby="form-title"
      >
        {/* Personal Information Section */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">{t("personal_information")}</legend>

          {/* Full Name */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="name" className="text-sm font-medium">{t("full_name")}<span className="text-red-500">{t("_")}</span>
              </Label>
              {errors.name && (
                <p className="text-sm text-red-500" id="name-error" aria-live="assertive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  className={cn(errors.name && "border-red-500")}
                  aria-invalid={!!errors.name}
                  {...field}
                />
              )}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="email" className="text-sm font-medium">{t("email")}<span className="text-red-500">{t("_")}</span>
              </Label>
              {errors.email && (
                <p className="text-sm text-red-500" id="email-error" aria-live="assertive">
                  {errors.email.message}
                </p>
              )}
            </div>
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
                  className={cn(errors.email && "border-red-500")}
                  aria-invalid={!!errors.email}
                  {...field}
                />
              )}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="phone" className="text-sm font-medium">{t("phone_number")}<span className="text-red-500">{t("_")}</span>
              </Label>
              {errors.phone && (
                <p className="text-sm text-red-500" id="phone-error" aria-live="assertive">
                  {errors.phone.message}
                </p>
              )}
            </div>
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
                  className={cn(errors.phone && "border-red-500")}
                  aria-invalid={!!errors.phone}
                  {...field}
                />
              )}
            />
          </div>
        </fieldset>

        {/* Event Information Section */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">{t("event_information")}</legend>

          {/* Event Name */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="event" className="text-sm font-medium">{t("event_name")}<span className="text-red-500">{t("_")}</span>
              </Label>
              {errors.event && (
                <p className="text-sm text-red-500" id="event-error" aria-live="assertive">
                  {errors.event.message}
                </p>
              )}
            </div>
            <Controller
              name="event"
              control={control}
              rules={{ required: "Event name is required" }}
              render={({ field }) => (
                <Input
                  type="text"
                  id="event"
                  placeholder="Enter the event name"
                  className={cn(errors.event && "border-red-500")}
                  aria-invalid={!!errors.event}
                  {...field}
                />
              )}
            />
          </div>
        </fieldset>

        {/* Additional Information Section */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">{t("additional_information")}</legend>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">{t("additional_comments")}</Label>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="message"
                  placeholder="Leave a message (optional)"
                  className="min-h-24"
                  {...field}
                />
              )}
            />
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register Now"}
          </Button>
          <p className="text-xs text-gray-500">
            <span className="text-red-500">{t("_")}</span>{t("indicates_required_fields")}</p>
        </div>
      </form>
    </div>
  );
};

export default ParticipantRegistrationForm;