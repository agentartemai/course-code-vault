import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Lock, BookOpen } from "lucide-react";

const LoginPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get stored codes from localStorage
    const storedCodes = JSON.parse(localStorage.getItem("courseCodes") || "[]");
    const codeExists = storedCodes.find((code: any) => code.code === accessCode);

    if (codeExists) {
      if (codeExists.used) {
        toast({
          title: "Code Already Used",
          description: "This access code has already been used and cannot be used again.",
          variant: "destructive",
        });
      } else {
        // Mark code as used permanently
        const updatedCodes = storedCodes.map((code: any) => 
          code.code === accessCode ? { ...code, used: true, usedAt: new Date().toISOString() } : code
        );
        localStorage.setItem("courseCodes", JSON.stringify(updatedCodes));
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("currentAccessCode", accessCode);
        
        toast({
          title: "Welcome!",
          description: "Access granted. Redirecting to your course...",
        });
        
        setTimeout(() => navigate("/course"), 1000);
      }
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your access code and try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card">
      <div className="w-full max-w-md p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Course Access
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your exclusive access code to unlock premium content
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-to-b from-card to-muted/50 border-muted">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Access Portal
            </CardTitle>
            <CardDescription>
              Ready to transform your knowledge?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="text-center text-lg font-mono tracking-wider"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                disabled={isLoading || !accessCode.trim()}
              >
                {isLoading ? "Verifying..." : "Unlock Course"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Don't have an access code? Contact support for assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;