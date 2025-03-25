import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/mulit-select";
import useLanguage from "@/lib/hooks/useLang";
import { useUpdateUserProfileMutation } from "@/services/user";
import { RootState, useAppSelector } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod"; // For validation

// Define interests/volunteering domains
// const VOLUNTEERING_DOMAINS = [
//   "Education",
//   "Healthcare",
//   "Environment",
//   "Community Development",
//   "Technology",
//   "Arts and Culture",
//   "Social Services",
//   "Animal Welfare",
//   "Disaster Relief",
//   "Youth Empowerment",
// ];

// Validation schema
const userProfileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  volunteeringInterests: z.array(z.any()).optional(),
});

const UserProfilePage: React.FC = () => {
  const u = useAppSelector((state: RootState) => state.user);
  const VOLUNTEERING_DOMAINS = useAppSelector(
    //@ts-ignore
    (state: RootState) => state.eventDetails.voluneeringDomain
  );
  const { t } = useLanguage();
  const { mutate: updateUserProfile, isPending } =
    useUpdateUserProfileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: u.displayName || "",
      email: u.email || "",
      volunteeringInterests: u.volunteeringInterests || [],
    },
  });

  const onSubmit = (data: z.infer<typeof userProfileSchema>) => {
    updateUserProfile(data);
  };

  if (!u) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4" role="alert">
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-gray-500">
              {t("no_user_data_available_")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t("user_profile")}</h1>

      <Card className="overflow-hidden">
        <div className="px-6 p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end">
            <Avatar className="w-24 h-24 border-4 border-white rounded-full shadow-md">
              {u.profileImage && (
                <AvatarImage
                  src={u.profileImage}
                  alt={`${u.displayName}'s profile`}
                />
              )}
              <AvatarFallback>{u.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-grow flex-col flex justify-center my-auto ">
              <h2 className="text-2xl font-bold">{u.displayName}</h2>
              <p className="text-gray-500">
                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="border-t pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t("name")}</Label>
              <Controller
                name="displayName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    id="displayName"
                    className="w-full dark:text-neutral-850 text-neutral-800"
                  />
                )}
              />
              {errors.displayName && (
                <FormMessage className="text-red-500">
                  {errors.displayName.message}
                </FormMessage>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    className="w-full text-neutral-800 dark:text-neutral-850"
                    disabled
                  />
                )}
              />
              {errors.email && (
                <FormMessage className="text-red-500">
                  {errors.email.message}
                </FormMessage>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("volunteering_interests")}</Label>
              <Controller
                name="volunteeringInterests"
                control={control}
                render={({ field }) => {
                  return (
                    <MultiSelect
                      options={VOLUNTEERING_DOMAINS}
                      onValueChange={field.onChange}
                      value={field.value || []}
                      defaultValue={field.value || []}
                      placeholder={t("select_volunteering_domains")}
                      maxCount={3}
                      className="w-full text-gray-500 dark:text-gray-400"
                      id="volunteeringInterests"
                      aria-describedby="volunteeringInterests-error"
                    />
                  );
                }}
              />
              {errors.volunteeringInterests && (
                <FormMessage className="text-red-500">
                  <AlertCircle size={16} className="inline mr-2" />
                  {errors.volunteeringInterests.message}
                </FormMessage>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {t("save_changes")}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()}>
                {t("cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default UserProfilePage;
