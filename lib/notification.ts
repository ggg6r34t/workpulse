import { toast } from "@/app/hooks/useToast";

export const checkNotificationSupport = (): boolean => {
  return "Notification" in window;
};

export const isNotificationPermissionGranted = (): boolean => {
  return Notification.permission === "granted";
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!checkNotificationSupport()) {
    toast({
      title: "Notifications Not Supported",
      description: "Your browser doesn't support notifications",
      variant: "error",
    });
    return false;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    // Send a test notification
    new Notification("WorkPulse Timer", {
      body: "Notifications are now enabled!",
    });

    toast({
      title: "Notifications Enabled",
      description: "You'll receive reminders when you forget to track time",
      variant: "success",
    });
    return true;
  } else {
    toast({
      title: "Notifications Disabled",
      description: "You won't receive reminder notifications",
      variant: "error",
    });
    return false;
  }
};

export const sendNotification = (title: string, body: string): void => {
  if (isNotificationPermissionGranted()) {
    new Notification(title, { body });
  }
};
