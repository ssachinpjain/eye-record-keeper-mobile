
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  LogOut, 
  User, 
  Search, 
  Plus 
} from 'lucide-react';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  currentPath: string;
}

const Layout = ({ children, title, showBackButton = false, currentPath }: LayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-medical-100 safe-area-padding">
      {/* Header */}
      <header className="bg-medical-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2 text-white hover:bg-medical-700"
            >
              <ChevronLeft />
            </Button>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="text-white hover:bg-medical-700"
        >
          <LogOut />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {children}
      </main>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <Button 
            variant={currentPath === '/dashboard' ? "default" : "ghost"} 
            className={currentPath === '/dashboard' ? "bg-medical-500" : ""}
            onClick={() => navigate('/dashboard')}
          >
            <User className="mr-2 h-4 w-4" />
            Records
          </Button>
          <Button 
            variant={currentPath === '/search' ? "default" : "ghost"} 
            className={currentPath === '/search' ? "bg-medical-500" : ""}
            onClick={() => navigate('/search')}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button 
            variant={currentPath === '/add-record' ? "default" : "ghost"} 
            className={currentPath === '/add-record' ? "bg-medical-500" : ""}
            onClick={() => navigate('/add-record')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
