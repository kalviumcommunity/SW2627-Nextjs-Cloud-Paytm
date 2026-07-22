"use client";

export default function WelcomeSection({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-blue-600 mb-2">
            Welcome 👋
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Hello, {user.name}!
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your recharges and keep track of your transaction history.
          </p>
        </div>

        {/* <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-800">
              {user.name}
            </p>

            <p className="text-xs text-gray-500">
              Account active
            </p>
          </div>
        </div> */}

      </div>
    </div>
  );
}