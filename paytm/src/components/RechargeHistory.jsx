"use client";

import { useState, useEffect } from "react";
import { getRecharges } from "@/services/recharge";
import StatusBadge from "./StatusBadge";

export default function RechargeHistory({ filters, refreshKey }) {
    const [recharges, setRecharge] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchHistory = async () => {
        try {
            const response = await getRecharges(filters, page);

            setRecharge(response.data.recharges);
            setPagination(response.data.pagination);
        } catch (err) {
            console.log(err);
        }
    };

    // Total number of recharges across all pages
    const totalRecharges = pagination.total || 0;

    // Statistics for the currently displayed page
    const successfulRecharges = recharges.filter(
        (recharge) => recharge.status === "SUCCESS"
    ).length;

    const pendingRecharges = recharges.filter(
        (recharge) => recharge.status === "PENDING"
    ).length;

    const failedRecharges = recharges.filter(
        (recharge) => recharge.status === "FAILED"
    ).length;

    // Reset to first page whenever filters change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    // Fetch history immediately and poll every 5 seconds
    useEffect(() => {
        fetchHistory();

        const interval = setInterval(() => {
            fetchHistory();
        }, 5000);

        return () => clearInterval(interval);
    }, [filters, refreshKey, page]);

    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Recharge History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    View and track your recent recharge transactions.
                </p>
            </div>

            {/* Statistics */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">

                {/* Total */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        Total Recharges
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-600 sm:text-2xl">
                        {totalRecharges}
                    </p>
                </div>

                {/* Successful */}
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        Successful
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-600 sm:text-2xl">
                        {successfulRecharges}
                    </p>
                </div>

                {/* Pending */}
                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        Pending
                    </p>

                    <p className="mt-1 text-xl font-bold text-yellow-600 sm:text-2xl">
                        {pendingRecharges}
                    </p>
                </div>

                {/* Failed */}
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        Failed
                    </p>

                    <p className="mt-1 text-xl font-bold text-red-600 sm:text-2xl">
                        {failedRecharges}
                    </p>
                </div>

            </div>

            {/* Table */}
            {recharges.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
                    <p className="font-medium text-slate-600">
                        No recharge history found.
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                        Try changing your filters or make your first recharge.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-[850px] w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Transaction ID
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Mobile
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Operator
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Amount
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Date
                                </th>

                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Time
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {recharges.map((recharge) => {
                                const date = new Date(recharge.createdAt);

                                return (
                                    <tr
                                        key={recharge.id}
                                        className="border-t border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-700">
                                            {recharge.transactionId}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                            {recharge.mobileNumber}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                            {recharge.operator}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-700">
                                            ₹{recharge.amount}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            <StatusBadge
                                                status={recharge.status}
                                            />
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                            {date.toLocaleDateString()}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                            {date.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-center text-sm text-slate-500 sm:text-left">
                    Page {page} of {pagination.totalPages || 1}
                </p>

                <div className="flex justify-center gap-2 sm:justify-end">

                    <button
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page === 1}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={
                            page >= (pagination.totalPages ?? 1)
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>
            </div>

        </section>
    );
}