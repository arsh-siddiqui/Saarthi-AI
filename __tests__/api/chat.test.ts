import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/groq', () => ({
  askGroq: vi.fn().mockResolvedValue('{"reply": "This is a mock chat response."}')
}));

describe('Chat API', () => {
  it('returns 400 if message is missing', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('returns a valid response', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply.reply).toBe('This is a mock chat response.');
  });
});
