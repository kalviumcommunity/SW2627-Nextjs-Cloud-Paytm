export default function Navbar() {
    return (
        <nav className="bg-blue-600 text-white p-4 shadow">
            <div className="max-w-6xl mx-auto flex justify-between">
                <h1 className="text-2xl font-bold">
                    Paytm Dashboard
                </h1>

                <button className="bg-red-500 px-4 py-2 rounded">
                    Logout
                </button>
            </div>
        </nav>
    );
}