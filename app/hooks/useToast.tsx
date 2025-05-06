"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Loader2, X, Info } from "lucide-react";
import toast from "react-hot-toast";

type ToastActionElement = React.ReactElement;

interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  variant?: "default" | "success" | "error" | "warning" | "loading" | "info";
}

const showToast = ({
  id,
  title,
  description,
  action,
  duration = 3000,
  variant = "default",
}: ToastProps) => {
  if (id) toast.dismiss(id);

  const toastId = toast.custom(
    (t) => {
      const variantConfig = {
        default: {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          border: "border-blue-200 dark:border-blue-800",
        },
        success: {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          border: "border-emerald-200 dark:border-emerald-800",
        },
        error: {
          icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
          border: "border-rose-200 dark:border-rose-800",
        },
        loading: {
          icon: <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />,
          border: "border-amber-200 dark:border-amber-800",
        },
        info: {
          icon: <Info className="h-5 w-5 text-sky-500" />,
          border: "border-sky-200 dark:border-sky-800",
        },
        warning: {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          border: "border-yellow-200 dark:border-yellow-800",
        },
      }[variant];

      return (
        <div
          className={`group relative flex w-full max-w-sm items-start gap-3 rounded-xl bg-card ${
            variantConfig.border
          } p-4 shadow-lg backdrop-blur-sm transition-all ${
            t.visible ? "animate-in fade-in-90" : "animate-out fade-out-90"
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">{variantConfig.icon}</div>

          <div className="flex-1">
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {action && <div className="mt-2">{action}</div>}
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted/50 hover:text-foreground group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    },
    {
      duration,
      id: id || `toast-${Date.now()}`,
      position: "bottom-right",
    }
  );

  return toastId;
};

const toastFn = Object.assign((props: ToastProps) => showToast(props), {
  success: (props: Omit<ToastProps, "variant">) =>
    showToast({ ...props, variant: "success" }),
  error: (props: Omit<ToastProps, "variant">) =>
    showToast({ ...props, variant: "error" }),
  loading: (props: Omit<ToastProps, "variant">) =>
    showToast({ ...props, variant: "loading" }),
  info: (props: Omit<ToastProps, "variant">) =>
    showToast({ ...props, variant: "info" }),
  dismiss: toast.dismiss,
  promise: toast.promise,
});

export { toastFn as toast };
