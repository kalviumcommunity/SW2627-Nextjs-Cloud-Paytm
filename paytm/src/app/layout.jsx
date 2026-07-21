import "./globals.css"
import { Toaster } from "react-hot-toast";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
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
      </body>
    </html>
  );
}