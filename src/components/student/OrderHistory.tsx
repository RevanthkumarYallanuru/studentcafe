
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/authService";
import { getOrdersByUser, Order } from "@/services/orderService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle, ChefHat, ThumbsUp, Package, XCircle } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    // Load user's orders
    if (user && user.rollNo) {
      loadOrders();
      
      // Set up polling for real-time updates
      const interval = setInterval(() => {
        loadOrders();
      }, 3000); // Poll every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadOrders = () => {
    if (user && user.rollNo) {
      const userOrders = getOrdersByUser(user.rollNo);
      // Sort orders by timestamp (newest first)
      userOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setOrders(userOrders);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-cafeteria-pending" />;
      case "Accepted":
        return <CheckCircle className="h-5 w-5 text-cafeteria-secondary" />;
      case "Preparing":
        return <ChefHat className="h-5 w-5 text-cafeteria-preparing" />;
      case "Ready":
        return <ThumbsUp className="h-5 w-5 text-cafeteria-ready" />;
      case "Delivered":
        return <Package className="h-5 w-5 text-cafeteria-delivered" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-cafeteria-rejected" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Accepted":
        return "status-accepted";
      case "Preparing":
        return "status-preparing";
      case "Ready":
        return "status-ready";
      case "Delivered":
        return "status-delivered";
      case "Rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="py-8 text-center bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders found. Order something from the menu!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.orderId} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                  <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                  <CardDescription>
                    {formatDateTime(order.timestamp)}
                  </CardDescription>
                </div>
                <div className={`status-badge ${getStatusClass(order.status)} flex items-center space-x-1 px-3 py-1`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>
                        {item.name} x {item.qty}
                      </span>
                      <span>₹{(item.price * item.qty).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
