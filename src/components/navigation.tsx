import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, User, LogOut, Menu, Store, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();
  const { getTotalItems, hasItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavigationItems = () => (
    <>
      {/* Main Navigation Links */}
      {!user && (
        <>
          <Link to="/features">
            <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
              Features
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
              Pricing
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
              Contact
            </Button>
          </Link>
        </>
      )}
      
      {/* User-specific Navigation */}
      {user && (
        <>
          {user.role === "admin" && (
            <Link to="/admin-dashboard">
              <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
          
          {user.role === "vendor" && (
            <Link to="/vendor-dashboard">
              <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
                <Store className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          )}
          
          {user.role === "customer" && (
            <>
              <Link to="/customer/dashboard">
                <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/checkout">
                <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {hasItems() && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start sm:w-auto">
                <User className="h-4 w-4 mr-2" />
                <span className="truncate">{user.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      
      {/* Auth Button for non-logged-in users */}
      {!user && (
        <Link to="/auth">
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
            Get Started
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto mobile-safe">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/bajgo-logo.jpg" alt="BajGo" className="h-8 w-8 sm:h-10 sm:w-10 mr-2 rounded-full object-cover" />
            <span className="text-lg sm:text-xl font-bold text-primary">BajGo</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationItems />
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavigationItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
    </nav>
  );
}
