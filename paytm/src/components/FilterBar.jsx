"use client";

export default function FilterBar({
    filters,
    setFilters,
    onApply,
    onReset,
}) {

    function handleChange(e){
        setFilters((prev)=>({...prev , [e.target.name]:e.target.value}));
    }
    return (
        <div className="bg-white rounded-lg shadow p-5 mb-6">
            <h2 className="text-xl font-semibold mb-4">
                Filter Recharge History
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Operator */}
                <select
                name="operator"
                    value={filters.operator}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                >
                    <option value="">All Operators</option>
                    <option value="JIO">JIO</option>
                    <option value="AIRTEL">AIRTEL</option>
                    <option value="VI">VI</option>
                    <option value="BSNL">BSNL</option>
                </select>

                {/* Date */}
                <input
                name="date"
                    type="date"
                    value={filters.date}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                />

                {/* Apply */}
                <button
                    onClick={onApply}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                >
                    Apply Filters
                </button>

                {/* Reset */}
                <button
                    onClick={onReset}
                    className="bg-gray-300 rounded-lg px-4 py-2 hover:bg-gray-400"
                >
                    Reset
                </button>

            </div>
        </div>
    );
}