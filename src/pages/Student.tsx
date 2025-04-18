
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/services/authService";
import { initializeMenu } from "@/services/menuService";
import { initializeOrders } from "@/services/orderService";
import StudentNavbar from "@/components/student/StudentNavbar";
import MenuList from "@/components/student/MenuList";
import OrderHistory from "@/components/student/OrderHistory";

const Student = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in as student
    const user = getCurrentUser();
    if (!user || user.role !== "student") {
      navigate("/");
      return;
    }

    // Initialize data if needed
    initializeMenu();
    initializeOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cafeteria-background">
      <StudentNavbar />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="menu">
            <MenuList />
          </TabsContent>
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Student;
