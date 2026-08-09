import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const agentSource = await readFile(new URL('../src/lib/ai/sales-engineer-agent.ts', import.meta.url), 'utf8');
const routeSource = await readFile(new URL('../src/app/api/ai/sales-engineer/route.ts', import.meta.url), 'utf8');

test('sales engineer exposes a bounded lead handoff qualification tool', () => {
  assert.match(agentSource, /"qualify_lead_handoff"/);
  assert.match(agentSource, /buildLeadHandoffQualification/);
  assert.match(agentSource, /qualificationScore/);
  assert.match(agentSource, /missingContactFields/);
  assert.match(agentSource, /missingProjectFields/);
  assert.match(agentSource, /handoffReady/);
});

test('handover is gated by qualification instead of being asserted optimistically', () => {
  assert.match(agentSource, /nextAction=handover/);
  assert.match(agentSource, /handoffReady=true/);
  assert.match(routeSource, /buildLeadHandoffQualification\(agentRequest\.memory\)/);
});

test('handoff qualification reuses project memory and does not create a parallel CRM store', () => {
  assert.doesNotMatch(agentSource, /createClient\(|supabase|project_inquiries|insert\(/i);
  assert.doesNotMatch(routeSource, /createClient\(|project_inquiries|insert\(/i);
});
