
import React, { useState, useEffect } from "react";
import { getMenuItems, MenuItem } from "@/services/menuService";
import { addToCart } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search } from "lucide-react";

const MenuList = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load menu items
    const items = getMenuItems();
    setMenuItems(items);
    setFilteredItems(items);
  }, []);

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery.trim() === "") {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, menuItems]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search by name, category, or description..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-8 text-center bg-white rounded-lg shadow">
          <p className="text-gray-500">No menu items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <span className="font-bold text-lg">₹{item.price.toFixed(2)}</span>
                </div>
                {item.category && (
                  <div className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {item.category}
                  </div>
                )}
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {item.description || "No description available"}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;
