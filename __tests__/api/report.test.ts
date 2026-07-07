import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/report/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/groq', () => ({
  askGroq: vi.fn().mockResolvedValue('{"title": "Pothole", "description": "Big pothole", "department": "PWD", "priority": "High", "category": "Roads"}')
}));

describe('Report API', () => {
  it('returns 400 if both message and image are missing', async () => {
    const req = new NextRequest('http://localhost/api/report', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns structured report when message is provided', async () => {
    const req = new NextRequest('http://localhost/api/report', {
      method: 'POST',
      body: JSON.stringify({ message: 'There is a pothole' }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe('Pothole');
    expect(data.department).toBe('PWD');
  });
});
