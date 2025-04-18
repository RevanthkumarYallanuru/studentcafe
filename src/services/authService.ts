
// Types
export interface User {
  role: "admin" | "staff" | "student";
  rollNo?: string;
  mobile?: string;
}

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  const user = localStorage.getItem("cafeteria_user");
  return !!user;
};

// Get the current user
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("cafeteria_user");
  if (!user) return null;
  return JSON.parse(user);
};

// Login the user
export const login = (userData: User): boolean => {
  try {
    // Validate user data based on role
    if (userData.role === "admin") {
      // Admin login doesn't require additional fields
    } else if (userData.role === "staff") {
      // Staff login doesn't require additional fields
    } else if (userData.role === "student") {
      // Student login requires rollNo and mobile
      if (!userData.rollNo || !userData.mobile) {
        return false;
      }
    } else {
      return false;
    }

    // Store user in localStorage
    localStorage.setItem("cafeteria_user", JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

// Logout the user
export const logout = (): void => {
  localStorage.removeItem("cafeteria_user");
  window.location.href = "/";
};
