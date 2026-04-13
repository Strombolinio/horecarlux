import { Link } from "@tanstack/react-router";
import { Building2, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { BrandName } from "./BrandName";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200"
            data-ocid="nav-logo"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              <BrandName />
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="nav-browse-rooms"
            >
              Browse Rooms
            </Link>
            <Link
              to="/restaurants"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="nav-browse-restaurants"
            >
              Browse Restaurants
            </Link>
            <Link
              to="/car-rentals"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="nav-browse-car-rentals"
            >
              Browse Car Rentals
            </Link>
            <Link
              to="/staff"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="nav-staff"
            >
              Staff Portal
            </Link>
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2"
                data-ocid="nav-logout"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={login}
                disabled={isLoading}
                className="gap-2"
                data-ocid="nav-login"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? "Signing in…" : "Staff Login"}
              </Button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Rooms
              </Link>
              <Link
                to="/restaurants"
                className="text-sm font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Restaurants
              </Link>
              <Link
                to="/car-rentals"
                className="text-sm font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Car Rentals
              </Link>
              <Link
                to="/staff"
                className="text-sm font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Staff Portal
              </Link>
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 justify-start"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                  className="gap-2 justify-start"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoading ? "Signing in…" : "Staff Login"}
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">
                <BrandName />
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
