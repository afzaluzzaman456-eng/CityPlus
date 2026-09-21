import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";

import Complaints from "../pages/complaints/Complaints";
import CreateComplaint from "../pages/complaints/CreateComplaint";
import ComplaintDetails from "../pages/complaints/ComplaintDetails";
import EditComplaint from "../pages/complaints/EditComplaint";

import Services from "../pages/services/Services";
import ServiceDetails from "../pages/services/ServiceDetails";
import CreateServiceRequest from "../pages/services/CreateServiceRequest";
import EditServiceRequest from "../pages/services/EditServiceRequest";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageComplaints from "../pages/admin/ManageComplaints";
import ManageServices from "../pages/admin/ManageServices";
import AdminProfile from "../pages/admin/AdminProfile";

function AppRoutes() {
    return (
        <Routes>

            {/* Main Website Layout */}
            <Route element={<MainLayout />}>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

            </Route>


            {/* Protected User Pages */}
            <Route element={<ProtectedRoute />}>

                <Route element={<DashboardLayout />}>

                    {/* Profile */}
                    <Route
                        path="/profile"
                        element={<Profile />}
                    />


                    {/* Complaints */}
                    <Route
                        path="/complaints"
                        element={<Complaints />}
                    />

                    <Route
                        path="/complaints/my"
                        element={<Complaints />}
                    />

                    <Route
                        path="/complaints/create"
                        element={<CreateComplaint />}
                    />

                    <Route
                        path="/complaints/:id"
                        element={<ComplaintDetails />}
                    />

                    <Route
                        path="/complaints/:id/edit"
                        element={<EditComplaint />}
                    />


                    {/* Service Requests */}
                    <Route
                        path="/services"
                        element={<Services />}
                    />

                    <Route
                        path="/services/create"
                        element={<CreateServiceRequest />}
                    />

                    <Route
                        path="/services/:id"
                        element={<ServiceDetails />}
                    />

                    <Route
                        path="/services/:id/edit"
                        element={<EditServiceRequest />}
                    />


                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>

                        <Route
                            path="/admin"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/complaints"
                            element={<ManageComplaints />}
                        />

                        <Route
                            path="/admin/services"
                            element={<ManageServices />}
                        />

                        <Route
                            path="/admin/profile"
                            element={<AdminProfile />}
                        />

                    </Route>

                </Route>

            </Route>

        </Routes>
    );
}

export default AppRoutes;