
import { MenuItem } from "./menuService";
import { User } from "./authService";

// Types
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus = "Pending" | "Accepted" | "Rejected" | "Preparing" | "Ready" | "Delivered";

export interface Order {
  orderId: number;
  user: {
    rollNo: string;
    mobile: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  timestamp: string;
  total: number;
}

// Cart related functions
export const getCart = (): OrderItem[] => {
  const cart = localStorage.getItem("cafeteria_cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: MenuItem, qty: number = 1): void => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex !== -1) {
    // Update quantity if item already exists
    cart[existingItemIndex].qty += qty;
  } else {
    // Add new item
    cart.push({ ...item, qty });
  }
  
  localStorage.setItem("cafeteria_cart", JSON.stringify(cart));
};

export const updateCartItemQty = (itemId: number, qty: number): void => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    if (qty <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart[itemIndex].qty = qty;
    }
    
    localStorage.setItem("cafeteria_cart", JSON.stringify(cart));
  }
};

export const clearCart = (): void => {
  localStorage.removeItem("cafeteria_cart");
};

// Order related functions
export const initializeOrders = (): void => {
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]));
  }
};

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem("orders");
  return orders ? JSON.parse(orders) : [];
};

export const getOrdersByUser = (rollNo: string): Order[] => {
  const orders = getOrders();
  return orders.filter(order => order.user.rollNo === rollNo);
};

export const getOrderById = (orderId: number): Order | null => {
  const orders = getOrders();
  const order = orders.find(order => order.orderId === orderId);
  return order || null;
};

export const placeOrder = (user: User, items: OrderItem[]): Order | null => {
  if (!user.rollNo || !user.mobile || items.length === 0) {
    return null;
  }
  
  const orders = getOrders();
  const newOrderId = orders.length > 0 ? Math.max(...orders.map(order => order.orderId)) + 1 : 1;
  
  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  const newOrder: Order = {
    orderId: newOrderId,
    user: {
      rollNo: user.rollNo,
      mobile: user.mobile
    },
    items,
    status: "Pending",
    timestamp: new Date().toISOString(),
    total
  };
  
  localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
  clearCart(); // Clear the cart after placing an order
  
  return newOrder;
};

export const updateOrderStatus = (orderId: number, status: OrderStatus): boolean => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.orderId === orderId);
  
  if (orderIndex === -1) return false;
  
  orders[orderIndex].status = status;
  localStorage.setItem("orders", JSON.stringify(orders));
  
  return true;
};
