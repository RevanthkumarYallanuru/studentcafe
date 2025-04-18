
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeOrders } from "@/services/orderService";
import { getCurrentUser } from "@/services/authService";
import StaffNavbar from "@/components/staff/StaffNavbar";
import OrderManagement from "@/components/staff/OrderManagement";

const Staff = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in as staff
    const user = getCurrentUser();
    if (!user || user.role !== "staff") {
      navigate("/");
      return;
    }

    // Initialize orders if needed
    initializeOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cafeteria-background">
      <StaffNavbar />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
        <OrderManagement />
      </div>
    </div>
  );
};

export default Staff;
