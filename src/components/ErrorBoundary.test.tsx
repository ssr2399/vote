import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    // Mock console.error to suppress noise in test output
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders error UI when a child throws', () => {
    const ThrowingComponent = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload Page' })).toBeInTheDocument();
  });

  it('error UI has role=alert for accessibility', () => {
    const ThrowingComponent = () => {
      throw new Error('Test Error');
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
