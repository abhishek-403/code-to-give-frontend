type Props = { children: React.ReactNode };
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { ThemeProvider } from "./theme-provider";

export function ToastProvider() {
  const { toasts } = useToasterStore();
  const limit = 3;
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= limit)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts, limit]);

  return (
    <Toaster
      position={1 ? "top-center" : "bottom-right"}
      containerClassName="dark"
      containerStyle={{
        zIndex: 9999,
      }}
      toastOptions={{
        className: "bg-neutral-90 border border-neutral-70 text-neutral-0 ",
      }}
    />
  );
}

export const queryClient = new QueryClient();

export default function GlobalProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ToastProvider />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// a good commit message for changes made to this file are:
// initially google console was showing error for router inside router
// so i removed the router from here and added it to the App.tsx file

// commit msg: removed router from here and added it to App.tsx file