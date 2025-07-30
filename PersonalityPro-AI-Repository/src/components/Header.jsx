import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PersonalityPro</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/test" 
              className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              Assessment
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 text-orange-600 bg-orange-50 rounded-lg font-medium hover:bg-orange-100 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/teams" 
              className="px-4 py-2 text-purple-600 bg-purple-50 rounded-lg font-medium hover:bg-purple-100 transition-colors"
            >
              Teams
            </Link>
            <Link 
              to="/resources" 
              className="px-4 py-2 text-green-600 bg-green-50 rounded-lg font-medium hover:bg-green-100 transition-colors"
            >
              Resources
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-purple-600 bg-purple-50 rounded-lg font-medium hover:bg-purple-100 transition-colors">
              Log In
            </button>
            <Link 
              to="/test"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

