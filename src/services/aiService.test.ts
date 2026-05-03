import { describe, it, expect, vi, beforeEach } from 'vitest';

import { askTutorialAssistant } from './aiService';

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns appropriate response for evm', async () => {
    const response = await askTutorialAssistant('What is an EVM?');
    expect(response).toContain('Electronic Voting Machine');
  });

  it('returns appropriate response for register', async () => {
    const response = await askTutorialAssistant('How to register?');
    expect(response).toContain('Voter registration is the crucial first step');
  });

  it('caches the response to avoid duplicate API calls', async () => {
    // Should be instant on second call due to cache
    const start1 = Date.now();
    await askTutorialAssistant('Where do I go?');
    const end1 = Date.now();
    
    const start2 = Date.now();
    await askTutorialAssistant('Where do I go?');
    const end2 = Date.now();

    expect(end2 - start2).toBeLessThan(end1 - start1);
  });
});
