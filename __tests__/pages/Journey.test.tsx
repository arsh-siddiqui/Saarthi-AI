import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JourneyPage from '@/app/journey/page';
import { SettingsProvider } from '@/context/SettingsContext';

// Mock child components
vi.mock('@/components/journey/JourneyPlanner', () => ({
  default: () => <div data-testid="journey-planner">Journey Planner Mock</div>
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SettingsProvider>
      {component}
    </SettingsProvider>
  );
};

describe('Journey Page', () => {
  it('renders journey planner', () => {
    renderWithProviders(<JourneyPage />);
    expect(screen.getByTestId('journey-planner')).toBeDefined();
  });
});
