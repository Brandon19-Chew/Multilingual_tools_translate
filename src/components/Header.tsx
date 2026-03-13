import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Languages, User, LogOut, Settings, MessageSquare, Shield, Menu } from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Languages className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden sm:inline">Translation Tool</span>
            <span className="text-xl font-bold sm:hidden">Translate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/">
                  <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm" asChild>
                    <span>Translate</span>
                  </Button>
                </Link>
                <Link to="/feedback">
                  <Button variant={isActive('/feedback') ? 'default' : 'ghost'} size="sm" asChild>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Feedback
                    </span>
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {profile?.username || 'User'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{profile?.username}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {profile?.role === 'admin' ? 'Administrator' : 'User'}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {profile?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm" asChild>
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {user ? (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {profile?.username || 'User'}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground text-left">
                      {profile?.role === 'admin' ? 'Administrator' : 'User'}
                    </p>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant={isActive('/') ? 'default' : 'ghost'} 
                        className="w-full justify-start"
                        asChild
                      >
                        <span>
                          <Languages className="h-4 w-4 mr-2" />
                          Translate
                        </span>
                      </Button>
                    </Link>
                    <Link to="/feedback" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant={isActive('/feedback') ? 'default' : 'ghost'} 
                        className="w-full justify-start"
                        asChild
                      >
                        <span>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Feedback
                        </span>
                      </Button>
                    </Link>
                    <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant={isActive('/settings') ? 'default' : 'ghost'} 
                        className="w-full justify-start"
                        asChild
                      >
                        <span>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </span>
                      </Button>
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant={isActive('/admin') ? 'default' : 'ghost'} 
                          className="w-full justify-start"
                          asChild
                        >
                          <span>
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Panel
                          </span>
                        </Button>
                      </Link>
                    )}
                    <div className="border-t border-border my-2" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Link to="/login">
                <Button size="sm" asChild>
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
