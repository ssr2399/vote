import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TutorialAssistant } from './TutorialAssistant';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollTo = vi.fn();

vi.mock('../services/aiService', () => ({
  askTutorialAssistant: vi.fn().mockResolvedValue('Mock response')
}));

describe('TutorialAssistant', () => {
  it('renders correctly', () => {
    render(<TutorialAssistant />);
    expect(screen.getByText(/Smart Tutorial Assist/i)).toBeInTheDocument();
    expect(screen.getByText(/Step-by-Step: The Booth Process/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/How do I use an EVM\?/i)).toBeInTheDocument();
  });

  it('can type and send a message via click', async () => {
    render(<TutorialAssistant />);
    const input = screen.getByPlaceholderText(/How do I use an EVM\?/i);
    fireEvent.change(input, { target: { value: 'test question' } });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(await screen.findByText('test question')).toBeInTheDocument();
  });

  it('can type and send a message via Enter key', async () => {
    render(<TutorialAssistant />);
    const input = screen.getByPlaceholderText(/How do I use an EVM\?/i);
    fireEvent.change(input, { target: { value: 'another question' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(await screen.findByText('another question')).toBeInTheDocument();
  });

  it('handles other key pushes', async () => {
    render(<TutorialAssistant />);
    const input = screen.getByPlaceholderText(/How do I use an EVM\?/i);
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'a' });
  });

  it('does nothing on empty input', async () => {
    render(<TutorialAssistant />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
  });

  it('does nothing if already loading', async () => {
    render(<TutorialAssistant />);
    const input = screen.getByPlaceholderText(/How do I use an EVM\?/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'loading question' } });
    fireEvent.click(button);
    fireEvent.click(button); // Second click will be ignored because it's loading
    expect(await screen.findByText('loading question')).toBeInTheDocument();
  });
});
