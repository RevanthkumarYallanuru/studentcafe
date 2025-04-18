
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { login } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [role, setRole] = useState<"admin" | "staff" | "student">("student");
  const [rollNo, setRollNo] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    const userData = {
      role,
      rollNo: role === "student" ? rollNo : undefined,
      mobile: role === "student" ? mobile : undefined,
    };

    const loginSuccess = login(userData);

    if (loginSuccess) {
      toast({
        title: "Login successful",
        description: `Welcome, ${role}!`,
      });

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "staff") {
        navigate("/staff");
      } else {
        navigate("/student");
      }
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cafeteria-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Campus Cafeteria</CardTitle>
          <CardDescription className="text-center text-primary-foreground/90">
            Sign in to access the cafeteria system
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6">
          <div className="space-y-2">
            <div className="space-y-4">
              <RadioGroup
                defaultValue="student"
                onValueChange={(value) => setRole(value as "admin" | "staff" | "student")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff">Cafeteria Staff</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {role === "student" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  placeholder="Enter your roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
