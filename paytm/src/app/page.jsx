export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-600">
            Recharge System
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Fast, Secure & Reliable Recharges
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            Stay connected with quick mobile recharges.
            <br />
            Track live transaction status, view recharge history,
            <br />
            and manage your recharges effortlessly.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 mt-10">

          <a
            href="/login"
            className="w-64 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </a>

          <a
            href="/register"
            className="w-64 border-2 border-blue-600 text-blue-600 text-center py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition duration-300"
          >
            Register
          </a>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-10"></div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Live Transaction Tracking</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Recharge History</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Smart Filters</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Duplicate Recharge Protection</span>
          </div>

        </div>

      </div>
    </div>
  );
}