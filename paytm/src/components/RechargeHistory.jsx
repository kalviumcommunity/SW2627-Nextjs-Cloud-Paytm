"use client";
import { useState , useEffect } from "react";
import { getRecharges } from "@/services/recharge";
import StatusBadge from "./StatusBadge";

export default function RechargeHistory({filters , refreshKey}) {
    const [recharges , setRecharge] = useState([]);
    const fetchHistory = async()=>{
        try{
            const response  = await getRecharges(filters);
            setRecharge(response.data.recharges)

        }catch(err){
            console.log(err);

        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
             fetchHistory();

            
        }, 5000);

        return ()=>clearInterval(interval)
   
}, [filters , refreshKey]);

    return (
        <div className="mt-10 bg-white p-5 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">
              Recharge History
            </h2>

             <div className="overflow-x-auto">

                {recharges.length === 0 ? (
    <p className="text-center py-6 text-gray-500">
        No recharge history found.
    </p>
) : (
    <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Operator</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
            </tr>
        </thead>

        <tbody>
            {recharges.map((recharge) => (
                <tr
                    key={recharge.id}
                    className="border-t hover:bg-gray-50"
                >
                    <td className="px-4 py-3">
                        {recharge.mobileNumber}
                    </td>

                    <td className="px-4 py-3">
                        {recharge.operator}
                    </td>

                    <td className="px-4 py-3">
                        ₹{recharge.amount}
                    </td>

                    <td className="px-4 py-3">
  <StatusBadge status={recharge.status} />
</td>

                    <td className="px-4 py-3">
                        {new Date(
                            recharge.createdAt
                        ).toLocaleDateString()}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)}
    
</div>
        </div>
    );
}