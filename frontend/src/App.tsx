import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import DepositPage from './pages/DepositPage';
import WithdrawalPage from './pages/WithdrawalPage';
import LevelsPage from './pages/LevelsPage';
import LoanReferralsPage from './pages/LoanReferralsPage';
import MemberReferralsPage from './pages/MemberReferralsPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

const queryClient = new QueryClient();

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched, refetch } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleProfileSetupComplete = () => {
    refetch();
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} onComplete={handleProfileSetupComplete} />
      <div className={showProfileSetup ? 'pointer-events-none' : ''}>
        <Outlet />
      </div>
    </>
  );
}

function IndexComponent() {
  const { identity } = useInternetIdentity();
  
  React.useEffect(() => {
    if (identity) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, [identity]);
  
  return null;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registration',
  component: RegistrationPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const depositRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deposit',
  component: DepositPage,
});

const withdrawalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/withdrawal',
  component: WithdrawalPage,
});

const levelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels',
  component: LevelsPage,
});

const loanReferralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loan-referrals',
  component: LoanReferralsPage,
});

const memberReferralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/member-referrals',
  component: MemberReferralsPage,
});

const transactionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transaction-history',
  component: TransactionHistoryPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: AdminUsersPage,
});

const adminRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/requests',
  component: AdminRequestsPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: AdminSettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registrationRoute,
  dashboardRoute,
  depositRoute,
  withdrawalRoute,
  levelsRoute,
  loanReferralsRoute,
  memberReferralsRoute,
  transactionHistoryRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminRequestsRoute,
  adminSettingsRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
