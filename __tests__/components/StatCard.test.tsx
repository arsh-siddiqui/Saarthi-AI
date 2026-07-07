import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from '../../components/cards/StatCard';

describe('StatCard', () => {
  it('renders value and label correctly', () => {
    render(<StatCard value="100+" label="Test Label" />);
    expect(screen.getByText('100+')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});
