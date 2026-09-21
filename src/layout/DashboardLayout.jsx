import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-base-200">

      <Navbar />

      <main className="w-full">
        <div className="w-full px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default DashboardLayout;