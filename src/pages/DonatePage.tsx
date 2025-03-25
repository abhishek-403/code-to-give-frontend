import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface DonateNowFormData {
  name: string;
  email: string;
  phone: string;
  amount: number;
  message?: string;
}

const DonateNowForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DonateNowFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      amount: 0,
      message: "",
    },
  });

  const onSubmit = (data: DonateNowFormData) => {
    console.log("Donation Data:", data);
    alert(`Thank you for donating ₹${data.amount}!`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-primary-600">
          <Button variant="outline" className="mb-4">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-4">Donate Now</h1>
        <p className="text-gray-600">
          Fill out the form below to make a donation. Required fields are marked
          with an asterisk (*).
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
          <legend className="text-xl font-semibold px-2">Personal Information</legend>

          {/* Full Name */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
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
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
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
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
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

        {/* Donation Information Section */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">Donation Information</legend>

          {/* Donation Amount */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="amount" className="text-sm font-medium">
                Donation Amount (₹) <span className="text-red-500">*</span>
              </Label>
              {errors.amount && (
                <p className="text-sm text-red-500" id="amount-error" aria-live="assertive">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "Donation amount is required",
                min: {
                  value: 1,
                  message: "Amount must be at least ₹1",
                },
              }}
              render={({ field }) => (
                <Input
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  className={cn(errors.amount && "border-red-500")}
                  aria-invalid={!!errors.amount}
                  {...field}
                />
              )}
            />
          </div>
        </fieldset>

        {/* Additional Information Section */}
        <fieldset className="space-y-4 border border-gray-200 rounded p-4">
          <legend className="text-xl font-semibold px-2">Additional Information</legend>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message (Optional)
            </Label>
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
            {isSubmitting ? "Submitting..." : "Donate Now"}
          </Button>
          <p className="text-xs text-gray-500">
            <span className="text-red-500">*</span> indicates required fields
          </p>
        </div>
      </form>
    </div>
  );
};

export default DonateNowForm;