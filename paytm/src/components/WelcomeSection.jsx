"use client";

export default function WelcomeSection({ user }) {
  return (
    <section className="mb-6 rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] to-[var(--surface-secondary)] p-5 shadow-sm transition-colors duration-300 sm:mb-8 sm:p-6">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
        Welcome back, {user?.name || "there"}! 👋
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        Manage your recharges and keep track of your transaction history
        all in one place.
      </p>
    </section>
  );
}