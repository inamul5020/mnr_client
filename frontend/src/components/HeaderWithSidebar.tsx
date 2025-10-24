import { Menu } from 'lucide-react';

interface HeaderWithSidebarProps {
  onMenuClick: () => void;
}

export function HeaderWithSidebar({ onMenuClick }: HeaderWithSidebarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 text-xl font-semibold text-gray-900 lg:ml-0">
              MNR Associates - Client Intake System
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
