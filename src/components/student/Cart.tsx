
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCart, updateCartItemQty, clearCart, placeOrder } from "@/services/orderService";
import { getCurrentUser } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import { Minus, Plus, X, ShoppingBag, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Cart = () => {
  const [cartItems, setCartItems] = useState(getCart());
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const refreshCart = () => {
    setCartItems(getCart());
  };

  const handleUpdateQuantity = (itemId: number, qty: number) => {
    updateCartItemQty(itemId, qty);
    refreshCart();
  };

  const handleClearCart = () => {
    clearCart();
    refreshCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add some items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    // Open payment dialog
    setIsPaymentDialogOpen(true);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (user && user.rollNo && user.mobile) {
        const order = placeOrder(user, cartItems);
        
        if (order) {
          toast({
            title: "Order placed successfully",
            description: `Your order #${order.orderId} has been placed.`,
          });
          setIsPaymentDialogOpen(false);
          refreshCart();
          navigate("/student"); // Refresh the page
        } else {
          toast({
            title: "Failed to place order",
            description: "Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "User not logged in",
          description: "Please log in to place an order.",
          variant: "destructive",
        });
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-4">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Add items from the menu to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={item.qty <= 1}
                    onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500"
                    onClick={() => handleUpdateQuantity(item.id, 0)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClearCart}
            disabled={cartItems.length === 0}
          >
            Clear
          </Button>
          <Button
            className="flex-1"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Checkout
          </Button>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              This is a simulated payment gateway for demonstration purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <ul className="space-y-1 mb-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.qty}
                    </span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-gray-50">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
                <h3 className="font-medium">Payment Method</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                This is a simulated payment. No actual payment will be processed.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCompletePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
