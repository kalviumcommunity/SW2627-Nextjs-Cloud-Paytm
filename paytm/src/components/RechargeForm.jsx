"use client";

import { useState } from "react";
import { createRecharge } from "@/services/recharge";
import { rechargeSchema } from "@/validations/rechargeValidation";
import toast from "react-hot-toast";

export default function RechargeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    operator: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const { mobileNumber, operator, amount } = formData;

    setLoading(true);

    try {
      const validation = rechargeSchema.safeParse(formData);

      if (!validation.success) {
        const newErrors = {};

        validation.error.issues.forEach((issue) => {
          const field = issue.path[0];

          if (!newErrors[field]) {
            newErrors[field] = issue.message;
          }
        });

        setErrors(newErrors);
        return;
      }

      const response = await createRecharge({
        mobileNumber,
        operator,
        amount: Number(amount),
      });

      if (response.data.success) {
        toast.success("Recharge request submitted successfully");

        setFormData({
          mobileNumber: "",
          operator: "",
          amount: "",
        });

        onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Make a Recharge
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the details below to initiate a mobile recharge.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobileNumber"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Mobile Number
            </label>

            <input
              id="mobileNumber"
              type="text"
              placeholder="Enter mobile number"
              maxLength={10}
              required
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {errors.mobileNumber && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.mobileNumber}
              </p>
            )}
          </div>

          {/* Operator */}
          <div>
            <label
              htmlFor="operator"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Operator
            </label>

            <select
              id="operator"
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select Operator</option>
              <option value="JIO">JIO</option>
              <option value="AIRTEL">AIRTEL</option>
              <option value="VI">VI</option>
              <option value="BSNL">BSNL</option>
            </select>

            {errors.operator && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.operator}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                ₹
              </span>

              <input
                id="amount"
                type="number"
                placeholder="Enter amount"
                required
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {errors.amount && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.amount}
              </p>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Proceed with Recharge"}
        </button>

      </form>
    </section>
  );
}