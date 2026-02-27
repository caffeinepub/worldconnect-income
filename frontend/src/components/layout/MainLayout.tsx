import React, { useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  History,
  Menu,
  X,
  LogOut,
  Phone,
  Heart,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/deposit', label: 'Deposit', icon: ArrowDownLeft },
  { to: '/withdraw', label: 'Withdraw', icon: ArrowUpRight },
  { to: '/levels', label: 'Levels', icon: TrendingUp },
  { to: '/transactions', label: 'Transactions', icon: History },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-red-md sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-heading font-bold text-lg">FinanceMLM</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-red-800 border-t border-red-600">
            <nav className="max-w-lg mx-auto px-4 py-3 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive = currentPath === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white font-medium'
                        : 'text-red-200 hover:bg-red-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-200 hover:bg-red-700 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-red-100 z-40 md:hidden shadow-red-md">
        <div className="max-w-lg mx-auto grid grid-cols-5 h-16">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-red-600' : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : ''}`} />
                <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-20 md:pb-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-red-900 text-white mt-auto pb-20 md:pb-0">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="font-heading font-bold">FinanceMLM</span>
              </div>
              <p className="text-red-300 text-xs">
                Your trusted partner for financial growth and network marketing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Support & Customer Care</h4>
              <div className="flex items-center gap-2 text-red-300 text-xs">
                <Phone className="w-3 h-3" />
                <span>WhatsApp: 9422018674</span>
              </div>
            </div>
          </div>

          <div className="border-t border-red-800 pt-4 flex flex-col items-center gap-1">
            <p className="text-red-400 text-xs">
              © {new Date().getFullYear()} FinanceMLM. All rights reserved.
            </p>
            <p className="text-red-400 text-xs flex items-center gap-1">
              Built with <Heart className="w-3 h-3 fill-red-500 text-red-500" /> using{' '}
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
        </div>
      </footer>
    </div>
  );
}
