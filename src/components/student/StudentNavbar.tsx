
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logout, getCurrentUser } from "@/services/authService";
import { getCart } from "@/services/orderService";
import Cart from "./Cart";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const cartItems = getCart();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-accent text-accent-foreground py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Campus Cafeteria</h1>
          {user?.rollNo && (
            <span className="ml-4 text-sm">Roll No: {user.rollNo}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative text-accent-foreground border-accent-foreground hover:bg-accent-foreground hover:text-accent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {cartItems.reduce((sum, item) => sum + item.qty, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" onClick={handleLogout} className="text-accent-foreground border-accent-foreground hover:bg-accent-foreground hover:text-accent">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
