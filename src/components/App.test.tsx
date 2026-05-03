import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollTo = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: null, profile: null, loading: false }))
}));

vi.mock('../services/aiService', () => ({
  askTutorialAssistant: vi.fn()
}));

vi.mock('../services/googleService', () => ({
  getPollingLocation: vi.fn(),
  loadGoogleMaps: vi.fn().mockRejectedValue(new Error('No Maps API key'))
}));

describe('App', () => {
  it('renders the header with V-O-T-E title', () => {
    render(<App />);
    expect(screen.getByText('V-O-T-E')).toBeInTheDocument();
  });

  it('renders the skip-to-content link correctly', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders the main sections', () => {
    render(<App />);
    // Main section roles/aria-labels
    expect(screen.getByRole('region', { name: 'Voter Profile Status' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Election Timeline' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Smart Tutorial Assistant' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Location Logistics' })).toBeInTheDocument();
  });

  it('renders footer buttons and text', () => {
    render(<App />);
    expect(screen.getByText(/SECURE CONNECTIVITY VIA FIREBASE AUTH.*ECI CIVIC INFORMATION API/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Support' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Official Website' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accessibility' })).toBeInTheDocument();
  });

  it('renders the ErrorBoundary wrapper', () => {
    // The App component renders ErrorBoundary at the root, which renders its children normally.
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('header shows sign-in prompt when no user', () => {
    render(<App />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('To view your status')).toBeInTheDocument();
  });
});
