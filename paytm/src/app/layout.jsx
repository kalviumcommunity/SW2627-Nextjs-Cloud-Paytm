import "./globals.css";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          {children}

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                minWidth: "400px",
                padding: "18px 24px",
                fontSize: "17px",
                borderRadius: "10px",
                background: "#1f2937",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}