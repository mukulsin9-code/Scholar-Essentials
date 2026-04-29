import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/20">
      <div className="max-w-md w-full bg-background rounded-2xl border border-border/50 p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
          <LogIn className="h-8 w-8" />
        </div>
        
        <h1 className="text-3xl font-serif font-bold mb-3">Welcome Back</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Sign in to your student account to buy, sell, and list accommodations.
        </p>
        
        <Button onClick={login} size="lg" className="w-full h-12 text-base hover-elevate">
          Sign in
        </Button>
        
        <p className="mt-6 text-xs text-muted-foreground">
          By signing in, you agree to our community guidelines. Keep the noticeboard clean!
        </p>
      </div>
    </div>
  );
}
