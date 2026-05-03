import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { loginWithGoogle, logout as firebaseLogout, db, auth } from '../services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';

vi.mock('../services/firebaseService', () => ({
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  auth: {},
  db: {}
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Provide a way to manually trigger auth state changes from tests if needed
    // For now we just mock the unsubscribe function return
    return vi.fn();
  })
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp')
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with loading state and null user', () => {
    const { result } = renderHook(() => useAuth());
    
    // Auth state changed is called on mount
    expect(onAuthStateChanged).toHaveBeenCalled();
    // Default values before the callback executes
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('login function calls loginWithGoogle', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login();
    });
    
    expect(loginWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('logout function calls firebaseLogout', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(firebaseLogout).toHaveBeenCalledTimes(1);
  });

  it('updateProfile does not work if user is not logged in', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.updateProfile({ isRegistered: true });
    });
    
    // Should not call setDoc since user is not set
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('cleans up auth listener on unmount', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(onAuthStateChanged).mockReturnValueOnce(mockUnsubscribe);

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('handles login error gracefully', async () => {
    vi.mocked(loginWithGoogle).mockRejectedValueOnce(new Error('Login failed'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login();
    });

    // Check that we caught it (or at least it didn't crash unhandled, though the test runner would catch a throw)
    expect(loginWithGoogle).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });
});
