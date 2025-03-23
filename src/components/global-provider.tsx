type Props = { children: React.ReactNode };
import { FontSizeContext } from "@/contexts/FontSizeContext";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

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
  const [fontSize, setFontSize] = useState(16);
  return (
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class">
            <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
              <ToastProvider />
              {children}
            </FontSizeContext.Provider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  );
}
