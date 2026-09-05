import test from 'node:test';
import assert from 'node:assert/strict';
import { generateToken, verifyToken } from '../../backend/middleware/auth.js';

test('Role-Based Access Control & JWT Token Tests', async (t) => {
  await t.test('1. Generates and verifies valid JWT payload for all 4 roles', () => {
    const roles = ['CUSTOMER', 'EMPLOYEE', 'MANAGER', 'ADMIN'];
    roles.forEach(role => {
      const user = { id: 'USR_' + role, email: role.toLowerCase() + '@demo.com', role: role, fullName: 'Test ' + role };
      const token = generateToken(user);
      assert.ok(token && typeof token === 'string');
      const decoded = verifyToken(token);
      assert.equal(decoded.role, role);
      assert.equal(decoded.email, user.email);
    });
  });

  await t.test('2. Invalid or tampered token returns null without throwing exceptions', () => {
    const invalid = verifyToken('invalid.token.signature');
    assert.equal(invalid, null);
  });
});
