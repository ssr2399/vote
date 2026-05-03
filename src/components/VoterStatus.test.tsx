import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoterStatus } from './VoterStatus';

const mockUseAuth = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

vi.mock('../services/googleService', () => ({
  getPollingLocation: vi.fn().mockResolvedValue(null)
}));

describe('VoterStatus', () => {
  it('renders login prompt when no user', () => {
    mockUseAuth.mockReturnValue({ user: null, login: vi.fn(), profile: null, loading: false });
    render(<VoterStatus />);
    expect(screen.getByText(/Sign in to Check Status/i)).toBeInTheDocument();
  });

  it('renders search address when user but not registered', () => {
    mockUseAuth.mockReturnValue({ 
      user: { uid: '123' }, 
      login: vi.fn(), 
      profile: { isRegistered: false }, 
      loading: false 
    });
    render(<VoterStatus />);
    expect(screen.getByPlaceholderText(/Enter full address.../i)).toBeInTheDocument();
  });

  it('renders profile when user is registered', () => {
    mockUseAuth.mockReturnValue({ 
      user: { uid: '123' }, 
      login: vi.fn(), 
      profile: { isRegistered: true, address: 'Test Address' }, 
      loading: false 
    });
    render(<VoterStatus />);
    expect(screen.getByText(/Assigned Polling Booth/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Address/i)).toBeInTheDocument();
  });

  it('logs in when check status is clicked and no user', () => {
    const login = vi.fn();
    mockUseAuth.mockReturnValue({ user: null, login, profile: null, loading: false });
    render(<VoterStatus />);
    const btn = screen.getByText(/Sign in to Check Status/i);
    fireEvent.click(btn);
    expect(login).toHaveBeenCalled();
  });

  it('handles address check when not registered', async () => {
    const updateProfile = vi.fn();
    mockUseAuth.mockReturnValue({ 
      user: { uid: '123' }, 
      login: vi.fn(), 
      profile: { isRegistered: false }, 
      loading: false,
      updateProfile
    });
    render(<VoterStatus />);
    
    const input = screen.getByPlaceholderText(/Enter full address.../i);
    fireEvent.change(input, { target: { value: '123 Test St' } });
    fireEvent.keyDown(input, { key: 'a' });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(updateProfile).toHaveBeenCalled());
    
    const btn = screen.getByText(/Verify My Status/i);
    fireEvent.click(btn);
    await waitFor(() => expect(updateProfile).toHaveBeenCalledTimes(2));
  });

  it('updates profile settings when registered', () => {
    const updateProfile = vi.fn();
    mockUseAuth.mockReturnValue({ 
      user: { uid: '123' }, 
      login: vi.fn(), 
      profile: { isRegistered: true, address: 'Test Address', idReady: false, pollingBoothKnown: false }, 
      loading: false,
      updateProfile
    });
    render(<VoterStatus />);
    
    const idCheck = screen.getByText(/EPIC \/ Valid Photo ID prepared/i);
    fireEvent.click(idCheck);
    expect(updateProfile).toHaveBeenCalledWith({ idReady: true });
    
    const boothCheck = screen.getByText(/Polling booth details reviewed/i);
    fireEvent.click(boothCheck);
    expect(updateProfile).toHaveBeenCalledWith({ pollingBoothKnown: true });
  });

  it('handles address check with empty address', async () => {
    const updateProfile = vi.fn();
    mockUseAuth.mockReturnValue({ 
      user: { uid: '123' }, 
      login: vi.fn(), 
      profile: { isRegistered: false }, 
      loading: false,
      updateProfile
    });
    render(<VoterStatus />);
    
    // submit empty address
    const btn = screen.getByText(/Verify My Status/i);
    fireEvent.click(btn);
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      address: '1600 Amphitheatre Pkwy'
    })));
  });

  it('renders profile with default address when missing', () => {
    mockUseAuth.mockReturnValue({ 
      user: { uid: '123' }, 
      login: vi.fn(), 
      profile: { isRegistered: true, idReady: true, pollingBoothKnown: true }, 
      loading: false 
    });
    render(<VoterStatus />);
    expect(screen.getByText(/1288 Oak St/i)).toBeInTheDocument();
  });
});
