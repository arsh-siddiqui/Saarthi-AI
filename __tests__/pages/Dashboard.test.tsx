import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from '@/app/dashboard/page';
import { SettingsProvider } from '@/context/SettingsContext';

// Mock QuickActions and other complex components if needed
vi.mock('@/components/dashboard/QuickActions', () => ({
  default: () => <div data-testid="quick-actions">Quick Actions</div>
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SettingsProvider>
      {component}
    </SettingsProvider>
  );
};

describe('Dashboard Page', () => {
  it('renders quick actions', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByTestId('quick-actions')).toBeDefined();
  });
});
