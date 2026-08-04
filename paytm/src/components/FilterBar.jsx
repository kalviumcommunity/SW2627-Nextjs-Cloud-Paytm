"use client";

export default function FilterBar({
    filters,
    setFilters,
    onApply,
    onReset,
}) {
    function handleChange(e) {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    return (
        <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-colors duration-300 sm:p-6">

            {/* Header */}
            <div className="mb-5">
                <h2 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
                    Filter Recharge History
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Filter your transactions by operator or date.
                </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Operator */}
                <div>
                    <label
                        htmlFor="operator"
                        className="mb-2 block text-sm font-medium text-[var(--text)]"
                    >
                        Operator
                    </label>

                    <select
                        id="operator"
                        name="operator"
                        value={filters.operator}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">All Operators</option>
                        <option value="JIO">JIO</option>
                        <option value="AIRTEL">AIRTEL</option>
                        <option value="VI">VI</option>
                        <option value="BSNL">BSNL</option>
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label
                        htmlFor="date"
                        className="mb-2 block text-sm font-medium text-[var(--text)]"
                    >
                        Date
                    </label>

                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={filters.date}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Apply */}
                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={onApply}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        Apply Filters
                    </button>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={onReset}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition-colors duration-300 hover:bg-[var(--surface-secondary)] focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                        Reset
                    </button>
                </div>

            </div>
        </section>
    );
}