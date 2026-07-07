import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '@/components/layout/Footer';
import { SettingsProvider } from '@/context/SettingsContext';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SettingsProvider>
      {component}
    </SettingsProvider>
  );
};

describe('Footer', () => {
  it('renders the branding text', () => {
    renderWithProviders(<Footer />);
    expect(screen.getAllByText(/Saarthi AI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Your AI Civic Companion/i)).toBeDefined();
  });

  it('renders quick links', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText('Platform')).toBeDefined();
    expect(screen.getByText('Services')).toBeDefined();
    expect(screen.getByText('Legal')).toBeDefined();
  });
});
