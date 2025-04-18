
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/services/authService";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Cafeteria Admin</h1>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
