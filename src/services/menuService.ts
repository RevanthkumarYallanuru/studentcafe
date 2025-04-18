
// Types
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
}

// Initialize the menu
export const initializeMenu = (): void => {
  if (!localStorage.getItem("menu")) {
    localStorage.setItem(
      "menu",
      JSON.stringify([
        { id: 1, name: "Burger", price: 50, description: "Delicious beef burger with veggies", category: "Fast Food", image: "/placeholder.svg" },
        { id: 2, name: "Pasta", price: 70, description: "Creamy tomato pasta", category: "Italian", image: "/placeholder.svg" },
        { id: 3, name: "Pizza", price: 120, description: "Cheese and veggie pizza", category: "Italian", image: "/placeholder.svg" },
        { id: 4, name: "Sandwich", price: 40, description: "Grilled vegetable sandwich", category: "Fast Food", image: "/placeholder.svg" },
        { id: 5, name: "French Fries", price: 30, description: "Crispy golden fries", category: "Snacks", image: "/placeholder.svg" },
        { id: 6, name: "Coffee", price: 25, description: "Hot brewed coffee", category: "Beverages", image: "/placeholder.svg" },
      ])
    );
  }
};

// Get all menu items
export const getMenuItems = (): MenuItem[] => {
  const menu = localStorage.getItem("menu");
  return menu ? JSON.parse(menu) : [];
};

// Add a new menu item
export const addMenuItem = (item: Omit<MenuItem, "id">): MenuItem => {
  const menu = getMenuItems();
  const newId = menu.length > 0 ? Math.max(...menu.map(item => item.id)) + 1 : 1;
  
  const newItem = { ...item, id: newId };
  localStorage.setItem("menu", JSON.stringify([...menu, newItem]));
  
  return newItem;
};

// Update a menu item
export const updateMenuItem = (id: number, updatedItem: Partial<MenuItem>): boolean => {
  const menu = getMenuItems();
  const itemIndex = menu.findIndex(item => item.id === id);
  
  if (itemIndex === -1) return false;
  
  menu[itemIndex] = { ...menu[itemIndex], ...updatedItem };
  localStorage.setItem("menu", JSON.stringify(menu));
  
  return true;
};

// Delete a menu item
export const deleteMenuItem = (id: number): boolean => {
  const menu = getMenuItems();
  const newMenu = menu.filter(item => item.id !== id);
  
  if (newMenu.length === menu.length) return false;
  
  localStorage.setItem("menu", JSON.stringify(newMenu));
  return true;
};
