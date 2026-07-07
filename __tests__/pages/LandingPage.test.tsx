import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LandingPage from '../../app/page';
import { SettingsProvider } from '../../context/SettingsContext';

describe('LandingPage', () => {
  it('renders the main heading', () => {
    render(<SettingsProvider><LandingPage /></SettingsProvider>);
    expect(screen.getByText(/Making Government Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Simple with AI/i)).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<SettingsProvider><LandingPage /></SettingsProvider>);
    expect(screen.getByText(/Explore Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/Talk to AI/i)).toBeInTheDocument();
  });
});
