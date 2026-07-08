export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Paytm Recharge
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome! Please login to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember Me
            </label>

            <a
              href="#"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          {/* Register */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </a>
          </p>

        </form>
      </div>
    </div>
  );
}