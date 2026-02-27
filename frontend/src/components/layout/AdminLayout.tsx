import React from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Shield,
  Phone,
  Heart,
} from 'lucide-react';

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/requests', label: 'Requests', icon: ClipboardList },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'finance-mlm'
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-red-900 to-red-800 text-white flex flex-col fixed h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-red-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-lg leading-tight">Admin Panel</p>
              <p className="text-red-300 text-xs">FinanceMLM</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-red-sm font-medium'
                    : 'text-red-200 hover:bg-red-700/60 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-red-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-200 hover:bg-red-700/60 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-red-700 space-y-2">
          <div className="flex items-center gap-2 text-red-300 text-xs">
            <Phone className="w-3 h-3" />
            <span>Support: 9422018674</span>
          </div>
          <p className="text-red-400 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 fill-red-500 text-red-500 mx-0.5" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-300 hover:text-white underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
