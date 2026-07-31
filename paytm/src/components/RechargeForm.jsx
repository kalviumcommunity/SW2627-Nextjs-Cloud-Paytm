"use client";

import { useState } from "react";
import { createRecharge } from "@/services/recharge";
import { rechargeSchema } from "@/validations/rechargeValidation";
import toast from "react-hot-toast";

const loadRazorpay = ()=> {
    return new Promise((resolve)=>{
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () =>{
        resolve(true);

      }
      script.onerror=()=>{
        resolve(false);
      };
      document.body.appendChild(script);
    })
  }

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
      setLoading(true);

      const response = await createRecharge({
        mobileNumber,
        operator,
        amount: Number(amount),
      });

      if (!response.data.success) {
        setLoading(false);
  toast.error(response.data.message ||
    "Unable to create recharge");
  return;
}

const loaded = await loadRazorpay();

if (!loaded) {
  setLoading(false);
  toast.error("Razorpay Checkout failed to load");
  return;
}



const { razorpayOrder } = response.data;

const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount:razorpayOrder.amount,
  currency:razorpayOrder.currency,
  name:"Paytm Dummy",
  description: `Recharge for ${mobileNumber}`,
  order_id: razorpayOrder.id,
  handler: async function (paymentResponse) {
    try {

      const verify = await fetch("/api/payment/verify" , {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          razorpay_order_id:paymentResponse.razorpay_order_id,
          razorpay_payment_id:paymentResponse.razorpay_payment_id,
          razorpay_signature:paymentResponse.razorpay_signature
        })
      });
      const data = await verify.json();

      if(data.success){
        setLoading(false)
        toast.success("Payment verified successfully");
        
        setFormData({mobileNumber:"" , 
          operator:"",
          amount:""
        })
        onSuccess();
      }else{
        setLoading(false);
        toast.error("Payment verification failed")
      }

      
    } catch (error) {
      console.error(error);
    toast.error("Something went wrong while verifying payment");
      
    }
    
  },
  modal:{
    ondismiss: function (){
      setLoading(false);
      setFormData({
        mobileNumber: "",
        operator: "",
        amount: "",
      });

      toast("Payment cancelled")
    }
  }
};
const razorpay = new window.Razorpay(options);

razorpay.on("payment.failed", async function (response) {
  console.log("Payment failed:", response);

  try {
    const failedPayment = await fetch("/api/payment/failed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrder.id,
      }),
    });

    const data = await failedPayment.json();

    if (data.success) {
      toast.error(
        response.error.description || "Payment failed"
      );

      setFormData({
        mobileNumber: "",
        operator: "",
        amount: "",
      });

      onSuccess();
    } else {
      toast.error("Failed to update recharge status");
    }
  } catch (error) {
    console.error("Failed payment update error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
});

razorpay.open();


        
      
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } 
  };

  return (
    <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-colors duration-300 sm:p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
          Make a Recharge
        </h2>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
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
              className="mb-2 block text-sm font-medium text-[var(--text)]"
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
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] outline-none transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="mb-2 block text-sm font-medium text-[var(--text)]"
            >
              Operator
            </label>

            <select
              id="operator"
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="mb-2 block text-sm font-medium text-[var(--text)]"
            >
              Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-secondary)]">
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
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-8 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] outline-none transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Proceed with Recharge"}
        </button>

      </form>
    </section>
  );
}