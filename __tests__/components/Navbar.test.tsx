import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from '@/components/layout/Navbar';
import { SettingsProvider } from '@/context/SettingsContext';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SettingsProvider>
      {component}
    </SettingsProvider>
  );
};

describe('Navbar', () => {
  it('renders the logo and title', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/Saarthi/i)).toBeDefined();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Platform')).toBeDefined();
    expect(screen.getByText('Services')).toBeDefined();
  });
});
