import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationStatus } from "@/lib/constants/server-constants";
import useLanguage from "@/lib/hooks/useLang";
import { useUpdateApplicationStatusMutation } from "@/services/event"; // Import API call
import { AlertCircle, Calendar, Check, X } from "lucide-react";
import { useState } from "react";

const ApplicationCard = ({ application, setSelectedEvent }: any) => {
  // const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const { t } = useLanguage()

  const [confirmAction, setConfirmAction] = useState<{
    status: ApplicationStatus;
  } | null>(null);

  // API Mutation Hook
  const { mutate: updateApplicationStatus, isPending } =
    useUpdateApplicationStatusMutation();

  // Function to trigger confirmation dialog
  const handleConfirm = (newStatus: ApplicationStatus) => {
    setConfirmAction({ status: newStatus });
  };

  // Function to actually update status

  const handleStatusUpdate = () => {
    if (!confirmAction) return;
    updateApplicationStatus({
      applicationId: application._id,
      status: confirmAction.status,
    });
    setConfirmAction(null);
    window.location.reload();
    setSelectedEvent(application.eventId)
  };

  return (
    <div
      key={application._id}
      className="flex w-full items-center justify-between border p-4 rounded-md shadow-sm"
    >
      <div>
        {/* Applicant Details */}
        <p className="font-medium">{application.applicantName}</p>
        <p className="text-sm text-gray-500">{application.applicantEmail}</p>
        <p className="text-sm text-gray-500">{t("_")}{application.applicantPhone}</p>

        {/* Volunteering Domain */}
        <p className="mt-2 text-sm">
          <strong>{t("_volunteering_domain_")}</strong>{" "}
          {application.volunteeringDomain?.name}
        </p>

        {/* Availability */}
        <p className="text-sm">
          <strong>{t("_availability_")}</strong> {application.availability}
        </p>

        {/* Willing Start & End Date */}
        <p className="text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4" /> <strong>{t("willing_dates_")}</strong>{" "}
          {new Date(application.willingStartDate).toLocaleDateString()}{t("_")}{" "}
          {new Date(application.willingEndDate).toLocaleDateString()}
        </p>

        {/* Notes */}
        <p className="text-sm mt-2">
          <strong>{t("_notes_")}</strong> {application.notes}
        </p>
      </div>
      {/* Approve & Reject Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="bg-green-100 text-green-700 hover:bg-green-200"
          onClick={() => handleConfirm(ApplicationStatus.APPROVED)}
          disabled={isPending}
        >
          <Check className="w-4 h-4 mr-1" />{t("approve")}</Button>
        <Button
          variant="outline"
          className="bg-red-100 text-red-700 hover:bg-red-200"
          onClick={() => handleConfirm(ApplicationStatus.REJECTED)}
          disabled={isPending}
        >
          <X className="w-4 h-4 mr-1" />{t("reject")}</Button>
      </div>
      {/* Confirmation Dialog */}
      <Dialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader className=" ">
            <DialogTitle className="flex gap-2 flex-row center items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-500" />{t("confirm_action")}</DialogTitle>
          </DialogHeader>
          <p>{t("are_you_sure_you_want_to_set_the_application_as")}{" "}
            <strong>{confirmAction?.status}</strong>{t("_")}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>{t("cancel")}</Button>
            <Button
              variant="destructive"
              onClick={handleStatusUpdate}
              disabled={isPending}
            >{t("confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationCard;
