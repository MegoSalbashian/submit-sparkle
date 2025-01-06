import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "admin123"; // In a real app, this would be stored securely

interface PasswordProtectedProps {
  children: React.ReactNode;
}

export const PasswordProtected = ({ children }: PasswordProtectedProps) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Access granted",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Access Required</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Access Admin Panel
          </Button>
        </form>
      </div>
    </div>
  );
};