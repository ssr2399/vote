import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavigationCard } from './NavigationCard';

vi.mock('../services/googleService', () => ({
  loadGoogleMaps: vi.fn().mockRejectedValue(new Error('No Maps API key'))
}));

describe('NavigationCard', () => {
  it('renders the header title correctly', () => {
    render(<NavigationCard />);
    expect(screen.getByText(/Booth Logistics & Traffic/i)).toBeInTheDocument();
  });

  it('renders the wait time section', () => {
    render(<NavigationCard />);
    expect(screen.getByText(/Wait Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Quiet/i)).toBeInTheDocument();
  });

  it('renders the access info section', () => {
    render(<NavigationCard />);
    expect(screen.getByText(/Access/i)).toBeInTheDocument();
    expect(screen.getByText(/PwD ramp entry/i)).toBeInTheDocument();
    expect(screen.getByText(/BLO volunteers/i)).toBeInTheDocument();
    expect(screen.getByText(/Parking/i)).toBeInTheDocument();
  });

  it('renders the required documents section', () => {
    render(<NavigationCard />);
    expect(screen.getByText(/REQUIRED:/i)).toBeInTheDocument();
    expect(screen.getByText(/EPIC card/i)).toBeInTheDocument();
    expect(screen.getByText(/Polling Slip/i)).toBeInTheDocument();
  });

  it('renders the Open in maps link with security attributes', () => {
    render(<NavigationCard />);
    const mapLink = screen.getByRole('link', { name: /Open in maps/i });
    expect(mapLink).toBeInTheDocument();
    expect(mapLink).toHaveAttribute('target', '_blank');
    expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has the correct aria-label on the root region', () => {
    render(<NavigationCard />);
    expect(screen.getByRole('region', { name: 'Location Logistics' })).toBeInTheDocument();
  });
});
