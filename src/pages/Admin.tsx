
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeMenu } from "@/services/menuService";
import { getCurrentUser } from "@/services/authService";
import AdminNavbar from "@/components/admin/AdminNavbar";
import MenuManagement from "@/components/admin/MenuManagement";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in as admin
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    // Initialize menu
    initializeMenu();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cafeteria-background">
      <AdminNavbar />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <MenuManagement />
      </div>
    </div>
  );
};

export default Admin;
