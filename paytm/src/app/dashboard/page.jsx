import Navbar from "@/components/Navbar";
import RechargeForm from "@/components/RechargeForm";
import RechargeHistory from "@/components/RechargeHistory";


export default async function Dashboard() {

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto p-6">
                <RechargeForm />

                <RechargeHistory />
            </div>
        </div>
    );
}