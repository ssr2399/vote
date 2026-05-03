import { describe, it, expect, vi, beforeEach } from 'vitest';

// Pre-mock the environment before module is required
vi.stubEnv('GEMINI_API_KEY', 'mock-api-key');

import { askTutorialAssistant } from './geminiService';

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(() => ({
    models: {
      generateContent: mockGenerateContent
    }
  }))
}));

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns response from Gemini API', async () => {
    mockGenerateContent.mockResolvedValueOnce({ text: 'This is a mock response from Gemini.' });
    
    const question = 'How do I vote?';
    const response = await askTutorialAssistant(question);
    
    expect(response).toBe('This is a mock response from Gemini.');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-2.0-flash',
      contents: question
    }));
  });

  it('caches the response to avoid duplicate API calls', async () => {
    mockGenerateContent.mockResolvedValueOnce({ text: 'A cached response.' });
    
    const question = 'What is EVM?';
    
    const response1 = await askTutorialAssistant(question);
    expect(response1).toBe('A cached response.');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);

    const response2 = await askTutorialAssistant(question);
    expect(response2).toBe('A cached response.');
    // Should NOT have called it again
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('returns a fallback message on API error', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API failed'));
    
    const question = 'When is election day?';
    const response = await askTutorialAssistant(question);
    
    expect(response).toBe("I'm having trouble connecting right now. Please try again in a moment.");
  });

  it('returns a fallback message when response text is empty', async () => {
    mockGenerateContent.mockResolvedValueOnce({ text: '' });
    
    const question = 'Can you help me?';
    const response = await askTutorialAssistant(question);
    
    expect(response).toBe("I'm having trouble connecting right now. Please try again in a moment.");
  });

  it('uses gemini-2.0-flash model', async () => {
    mockGenerateContent.mockResolvedValueOnce({ text: 'Model test response' });
    
    await askTutorialAssistant('Test model string');
    
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-2.0-flash'
      })
    );
  });
});
