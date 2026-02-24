import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiLinkedin } from 'react-icons/si';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { clear, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/deposit', label: 'Deposit' },
    { to: '/withdrawal', label: 'Withdrawal' },
    { to: '/levels', label: 'Levels' },
    { to: '/member-referrals', label: 'Referrals' },
    { to: '/transactions', label: 'Transactions' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <header className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-white font-display">MLM Platform</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors font-medium"
                  activeProps={{
                    className: 'bg-white/20 text-white',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Logout Button */}
            <div className="hidden md:block">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors font-medium"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors font-medium"
                    activeProps={{
                      className: 'bg-white/20 text-white',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 text-left text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-purple-700 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-display">About Us</h3>
              <p className="text-purple-100 text-sm">
                Building financial freedom through innovative MLM solutions and community growth.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-display">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="text-purple-100 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/levels" className="text-purple-100 hover:text-white transition-colors">
                    Level Structure
                  </Link>
                </li>
                <li>
                  <Link to="/member-referrals" className="text-purple-100 hover:text-white transition-colors">
                    Referrals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-display">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-white transition-colors"
                >
                  <SiFacebook size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-white transition-colors"
                >
                  <SiX size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-white transition-colors"
                >
                  <SiInstagram size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-white transition-colors"
                >
                  <SiLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-purple-600 mt-8 pt-6 text-center text-sm text-purple-100">
            <p>
              © {new Date().getFullYear()} MLM Platform. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'mlm-platform'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline font-medium"
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
