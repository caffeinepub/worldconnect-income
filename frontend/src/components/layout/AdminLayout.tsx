import React from 'react';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { clear } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/requests', icon: FileText, label: 'Requests' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold font-display">Admin Panel</h1>
              <p className="text-xs text-purple-200">Management Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-100 hover:text-white hover:bg-white/10 transition-colors"
                activeProps={{
                  className: 'bg-white/20 text-white',
                }}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-100 hover:text-white hover:bg-white/10 transition-colors w-full mt-8"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
