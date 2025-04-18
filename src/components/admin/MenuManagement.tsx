
import React, { useState, useEffect } from "react";
import { 
  getMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  MenuItem
} from "@/services/menuService";
import { useToast } from "@/hooks/use-toast";
import AddMenuItemDialog from "./menu/AddMenuItemDialog";
import EditMenuItemDialog from "./menu/EditMenuItemDialog";
import DeleteMenuItemDialog from "./menu/DeleteMenuItemDialog";
import MenuItemsTable from "./menu/MenuItemsTable";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const items = getMenuItems();
    setMenuItems(items);
  };

  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    try {
      const item = addMenuItem(newItem);
      setMenuItems([...menuItems, item]);
      toast({
        title: "Item added",
        description: `${item.name} has been added to the menu.`,
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      toast({
        title: "Error",
        description: "Failed to add menu item.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (updatedItem: MenuItem) => {
    try {
      const success = updateMenuItem(updatedItem.id, updatedItem);
      if (success) {
        loadMenuItems();
        setIsEditDialogOpen(false);
        setItemToEdit(null);
        toast({
          title: "Item updated",
          description: `${updatedItem.name} has been updated.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update menu item.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update item:", error);
      toast({
        title: "Error",
        description: "Failed to update menu item.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    try {
      const success = deleteMenuItem(itemToDelete.id);
      if (success) {
        loadMenuItems();
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
        toast({
          title: "Item deleted",
          description: `${itemToDelete.name} has been removed from the menu.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete menu item.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setItemToEdit(item);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <AddMenuItemDialog onAddItem={handleAddItem} />
      </div>

      <MenuItemsTable
        items={menuItems}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <EditMenuItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditItem}
        item={itemToEdit}
      />

      <DeleteMenuItemDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteItem}
        item={itemToDelete}
      />
    </div>
  );
};

export default MenuManagement;
