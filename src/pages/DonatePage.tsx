import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2 max-w-lg mx-auto my-auto"
        noValidate
      >
        <h1 className="text-2xl font-bold text-center">Donate Now</h1>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </Label>
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
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </Label>
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
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
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
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Donation Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Donation Amount (₹) <span className="text-red-500">*</span>
          </Label>
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
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Message (Optional)
          </Label>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <textarea
                id="message"
                placeholder="Leave a message (optional)"
                className="w-full border rounded p-2"
                {...field}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Donate Now"}
        </Button>
      </form>
    </div>
  );
};

export default DonateNowForm;
