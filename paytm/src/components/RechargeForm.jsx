"use client";

import { useState } from "react";
import { createRecharge } from "@/services/recharge";
import { rechargeSchema } from "@/validations/rechargeValidation";
import toast from "react-hot-toast";

export default function RechargeForm({onSuccess}) {
   const [formData , setFormData] = useState({
    mobileNumber:"",
    operator:"",
    amount:"",

   })
   const [loading ,setLoading] = useState(false);
   const [errors, setErrors] = useState({});

   function handleChange(e){

    setFormData((prev)=>({...prev , [e.target.name]:e.target.value}))

   }

   const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const { mobileNumber, operator, amount } = formData;

    setLoading(true);

    try {
      
      const validation = rechargeSchema.safeParse(formData);
      
      if(!validation.success){
        
        const newErrors={};
        validation.error.issues.forEach((issue)=>{
           const field = issue.path[0];

    if (!newErrors[field]) {
        newErrors[field] = issue.message;
    }
        })
        setErrors(newErrors);
        return;
      }
        const response = await createRecharge({
            mobileNumber,
            operator,
            amount: Number(amount),
        });
       

        if (response.data.success) {
           toast.success("Recharge request submitted successfully")
    setFormData({
        mobileNumber: "",
        operator: "",
        amount: "",
    }) 
    onSuccess();
}
}catch(error){
  toast.error(
  error.response?.data?.message || "Something went wrong"
);

}

        

     finally {
        setLoading(false);
    }
};

    return (
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-6">
    Make a Recharge
  </h2>
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
          {errors.mobileNumber && (
    <p className="text-red-500 text-sm mt-1">
        {errors.mobileNumber}
    </p>
)}
           

          
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
    {errors.operator && (
    <p className="text-red-500 text-sm mt-1">
        {errors.operator}
    </p>
)}
</div>
          

    
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Amount
            </label>

            <input
              type="number"
              
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
               name="amount" value={formData.amount} onChange={handleChange}
            />
            {errors.amount && (
    <p className="text-red-500 text-sm mt-1">
        {errors.amount}
    </p>
)}
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
        </div>
    );
}