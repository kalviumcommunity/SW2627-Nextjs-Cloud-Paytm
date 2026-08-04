export default function StatusBadge({ status }) {
  const styles = {
    SUCCESS: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        styles[status] || "bg-[var(--surface-secondary)] text-[var(--text)]"
      }`}
    >
      {status}
    </span>
  );
}