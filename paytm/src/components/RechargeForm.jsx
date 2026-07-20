"use client";

import { useState } from "react";
import { createRecharge } from "@/services/recharge";

export default function RechargeForm({onSuccess}) {
   const [formData , setFormData] = useState({
    mobileNumber:"",
    operator:"",
    amount:"",

   })
   const [loading ,setLoading] = useState(false);

   function handleChange(e){

    setFormData((prev)=>({...prev , [e.target.name]:e.target.value}))

   }

   const handleSubmit = async (e) => {
    e.preventDefault();
    const { mobileNumber, operator, amount } = formData;

    setLoading(true);

    try {
        const response = await createRecharge({
            mobileNumber,
            operator,
            amount: Number(amount),
        });
        alert("Recharge successful")

        if (response.success) {
    setFormData({
        mobileNumber: "",
        operator: "",
        amount: "",
    }) 
    onSuccess();
}
if(!response.success){
    return;

}

        console.log(response);

    } finally {
        setLoading(false);
    }
};

    return (
        <div>
          <form className="space-y-5" onSubmit={handleSubmit}>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mobile number
            </label>

            <input
              type="text"
              placeholder="Enter mobile number"
              maxLength={10}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>

          
          <div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Operator
  </label>

  <select
    name="operator"
    value={formData.operator}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select Operator</option>
    <option value="JIO">JIO</option>
    <option value="AIRTEL">AIRTEL</option>
    <option value="VI">VI</option>
    <option value="BSNL">BSNL</option>
  </select>
</div>
          

    
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Amount
            </label>

            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
               name="amount" value={formData.amount} onChange={handleChange}
            />
          </div>

          
         
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            {loading?"Processing":"Proceed"}
          </button>

        </form>
        </div>
    );
}