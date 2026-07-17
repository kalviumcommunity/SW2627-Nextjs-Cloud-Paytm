"use client"
import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import Navbar from "@/components/Navbar";
import RechargeForm from "@/components/RechargeForm";
import RechargeHistory from "@/components/RechargeHistory";


export default function Dashboard() {

    const [filters , setFilters] = useState({
        operator:"",
        date:""
    });
    const [appliedFilters , setAppliedFilters] = useState({
        operator:"",
        date:""

    })

    function handleApply(){
        setAppliedFilters(filters)
    }

    function handleReset(){
        setFilters({
            operator:"", 
            date:""
        })
        setAppliedFilters({
            operator:"", 
            date:""

        })
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto p-6">
                <RechargeForm />
                 <FilterBar
                filters={filters}
                setFilters={setFilters}
                onApply={handleApply}
                onReset={handleReset}
            />

                <RechargeHistory filters={appliedFilters}/>
            </div>
        </div>
    );
}