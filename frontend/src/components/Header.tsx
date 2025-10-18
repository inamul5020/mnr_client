import { Link } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">
                MNR Associates International
              </h1>
              <p className="text-sm text-gray-500">Client Intake System</p>
            </div>
          </div>
          
          <nav className="flex space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Client Form
            </Link>
            <Link
              to="/admin"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
            >
              <Users className="h-4 w-4 mr-1" />
              Admin Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
