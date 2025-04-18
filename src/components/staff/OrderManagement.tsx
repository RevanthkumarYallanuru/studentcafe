
import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatus, Order, OrderStatus } from "@/services/orderService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Clock, CheckCircle, ChefHat, ThumbsUp, Package } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");
  const { toast } = useToast();

  useEffect(() => {
    // Load orders
    loadOrders();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      loadOrders();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const allOrders = getOrders();
    setOrders(allOrders);
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  const handleUpdateStatus = (orderId: number, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);

    if (updated) {
      loadOrders();
      toast({
        title: "Status updated",
        description: `Order #${orderId} status has been updated to ${newStatus}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "Pending":
        return "Accepted";
      case "Accepted":
        return "Preparing";
      case "Preparing":
        return "Ready";
      case "Ready":
        return "Delivered";
      default:
        return null;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
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
        return <Package className="h-5 w-5 text-cafeteria-rejected" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="Pending" onValueChange={(value) => setActiveTab(value as OrderStatus)}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Accepted">Accepted</TabsTrigger>
          <TabsTrigger value="Preparing">Preparing</TabsTrigger>
          <TabsTrigger value="Ready">Ready</TabsTrigger>
          <TabsTrigger value="Delivered">Delivered</TabsTrigger>
        </TabsList>

        {["Pending", "Accepted", "Preparing", "Ready", "Delivered"].map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getOrdersByStatus(status as OrderStatus).length === 0 ? (
                <div className="col-span-full py-8 text-center bg-white rounded-lg shadow">
                  <p className="text-gray-500">No {status.toLowerCase()} orders found.</p>
                </div>
              ) : (
                getOrdersByStatus(status as OrderStatus).map((order) => (
                  <Card key={order.orderId} className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                        <CardDescription>
                          Roll No: {order.user.rollNo} • {formatDateTime(order.timestamp)}
                        </CardDescription>
                      </div>
                      <div className="status-badge status-pending flex items-center space-x-1 px-3 py-1">
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
                    <CardFooter className="flex justify-between">
                      {status === "Pending" && (
                        <>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleUpdateStatus(order.orderId, "Rejected")}
                          >
                            Reject
                          </Button>
                          <Button 
                            onClick={() => handleUpdateStatus(order.orderId, "Accepted")}
                          >
                            Accept
                          </Button>
                        </>
                      )}
                      {["Accepted", "Preparing", "Ready"].includes(status) && 
                        getNextStatus(order.status) && (
                          <Button 
                            className="w-full"
                            onClick={() => 
                              handleUpdateStatus(
                                order.orderId, 
                                getNextStatus(order.status) as OrderStatus
                              )
                            }
                          >
                            Mark as {getNextStatus(order.status)}
                          </Button>
                        )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OrderManagement;
