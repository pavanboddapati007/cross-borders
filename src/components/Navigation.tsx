import React from 'react';
import { Home, MessageSquare, Bot, Newspaper, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IM</span>
              </div>
              <span className="text-xl font-bold text-white">ImmigrantConnect</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'feed', label: 'Community', icon: MessageSquare },
                { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
                { id: 'news', label: 'News', icon: Newspaper },
                { id: 'admin', label: 'Admin', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <>
                {/* <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Sign In
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button> */}
              </>
            )}
            
            {/* Mobile Menu Button (Hidden on larger screens) */}
            {/* <Button variant="outline" size="icon" className="ml-auto md:hidden">
              <Menu className="h-5 w-5" />
            </Button> */}
          </div>
        </div>

        {/* Mobile Menu (Conditionally rendered) */}
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 text-white">
            <div className="grid gap-4 py-4">
              {navigationItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Button variant="ghost" className="justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet> */}
      </div>
    </nav>
  );
};

export default Navigation;
