export const metadata = {
  title: "Login",
  description: "Login Page",
};

export default function LoginLayout({ children }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        {children}
      </div>
    </main>
  );
}