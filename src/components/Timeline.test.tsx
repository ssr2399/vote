import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from './Timeline';

describe('Timeline', () => {
  it('renders all 3 timeline steps correctly', () => {
    render(<Timeline />);
    expect(screen.getByText(/ECI Election Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/Electoral Roll Freeze/i)).toBeInTheDocument();
    expect(screen.getByText(/Advance \/ Postal Ballot Window/i)).toBeInTheDocument();
    expect(screen.getByText(/General Election Day/i)).toBeInTheDocument();
  });

  it('renders the status badges for steps', () => {
    render(<Timeline />);
    expect(screen.getAllByText('COMPLETED')[0]).toBeInTheDocument();
    expect(screen.getByText('ACTIVE NOW')).toBeInTheDocument();
    expect(screen.getByText('UPCOMING')).toBeInTheDocument();
  });

  it('shows the dynamic countdown or completed status', () => {
    render(<Timeline />);
    // Since the election date is in the past, it should show COMPLETED
    expect(screen.getAllByText('COMPLETED').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Google Calendar button with correct attributes', () => {
    render(<Timeline />);
    const link = screen.getByRole('link', { name: /Sync ECI Election Dates to Google Calendar/i });
    expect(link).toHaveAttribute('href');
    expect(link.getAttribute('href')).toContain('calendar.google.com/calendar/render');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
