
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarIcon, HomeIcon, LayoutDashboardIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon size={18} /> },
    { path: '/rooms', label: 'Rooms', icon: <LayoutDashboardIcon size={18} /> },
    { path: '/reservations', label: 'My Reservations', icon: <CalendarIcon size={18} /> },
    { path: '/profile', label: 'Profile', icon: <UserIcon size={18} /> },
  ];
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/40">
      {/* Mobile Nav */}
      <div className="md:hidden border-b bg-background p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-primary">MeetRoom</Link>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={location.pathname === item.path ? "default" : "ghost"} 
                  size="icon"
                  className="rounded-full"
                >
                  {item.icon}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-background pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="font-bold text-2xl text-primary">MeetRoom</Link>
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col md:pl-64 w-full">
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
