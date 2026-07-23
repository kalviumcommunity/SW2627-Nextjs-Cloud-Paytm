"use client";

export default function WelcomeSection({ user }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-blue-50 p-5 shadow-sm sm:mb-8 sm:p-6">
      <p className="text-sm font-semibold text-blue-600">
        Welcome back 👋
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Hello, {user?.name}!
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
        Manage your recharges and keep track of your transaction history
        all in one place.
      </p>
    </section>
  );
}