import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../../backend/data/db.js';

test('API JSON Guarantees & Database Integrity Tests', async (t) => {
  await t.test('1. Database initialized with seeded users, applications, and settings', () => {
    assert.ok(db.data.users.length >= 4);
    assert.ok(db.data.applications.length >= 1);
    assert.ok(db.data.settings.interestRates);
  });

  await t.test('2. Audit logs record state transitions', () => {
    const countBefore = db.data.auditLogs.length;
    db.logAudit('TEST_RUNNER', 'SYSTEM', 'HEALTH_CHECK', null, null, null, { passed: true });
    assert.equal(db.data.auditLogs.length, countBefore + 1);
  });
});
