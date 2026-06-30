import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Test Suite: Employee/User API contract checks
 * Verifies: API responses match expected schema and status codes
 *
 * Target: https://reqres.in (public test API) — stands in for an internal
 * employee-management API endpoint in this demo.
 *
 * Traceability: TC-API-001, TC-API-002, TC-API-003 (see docs/test-plan.md)
 */

const BASE_URL = 'https://reqres.in/api';

interface UserResponse {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

async function fetchUser(id: number): Promise<{ status: number; body: UserResponse }> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: { 'x-api-key': 'reqres-free-v1' },
  });
  const body = (await res.json()) as UserResponse;
  return { status: res.status, body };
}

describe('Employee API contract', () => {
  it('TC-API-001: GET /users/:id returns 200 and a well-formed user object', async () => {
    const { status, body } = await fetchUser(2);

    expect(status).toBe(200);
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('email');
    expect(typeof body.data.email).toBe('string');
    expect(body.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('TC-API-002: requesting a non-existent user returns 404', async () => {
    const res = await fetch(`${BASE_URL}/users/9999`, {
      headers: { 'x-api-key': 'reqres-free-v1' },
    });
    expect(res.status).toBe(404);
  });

  it('TC-API-003: response time for GET /users/:id is under 2000ms', async () => {
    const start = Date.now();
    await fetchUser(3);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });
});
