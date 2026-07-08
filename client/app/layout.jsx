import "./globals.css";

export const metadata = {
  title: {
    default: "Paytm Clone",
    template: "%s | Paytm Clone",
  },
  description: "A Paytm Clone built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}