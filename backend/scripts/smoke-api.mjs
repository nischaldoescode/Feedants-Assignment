// api smoke test
import assert from 'node:assert/strict';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:4000/api';
const slug = 'feedants-classical-dance';
const registeredUser = 'demo-user-1';
const newUser = `smoke-user-${Date.now()}`;

// request helper with response body
async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const json = await response.json();

  return { response, json };
}

// assert the seeded registered state
const health = await request('/health');
assert.equal(health.response.status, 200);
assert.equal(health.json.ok, true);

const registeredDetail = await request(`/competitions/${slug}`, {
  headers: { 'x-user-id': registeredUser }
});
assert.equal(registeredDetail.response.status, 200);
assert.equal(registeredDetail.json.data.viewer.isRegistered, true);
assert.match(
  registeredDetail.json.data.viewer.primaryAction.kind,
  /upload_submission|update_submission|registered_waiting|judging|view_results/
);

// anonymous writes should fail
const missingUser = await request(`/competitions/${slug}/register`, {
  method: 'POST',
  body: JSON.stringify({ language: 'en' })
});
assert.equal(missingUser.response.status, 401);

// a fresh user can reserve one spot while registration is open
const registration = await request(`/competitions/${slug}/register`, {
  method: 'POST',
  headers: { 'x-user-id': newUser },
  body: JSON.stringify({ language: 'en' })
});
assert.equal(registration.response.status, 201);
assert.equal(registration.json.data.viewer.isRegistered, true);

// duplicate registration stays idempotent
const duplicate = await request(`/competitions/${slug}/register`, {
  method: 'POST',
  headers: { 'x-user-id': newUser },
  body: JSON.stringify({ language: 'en' })
});
assert.equal(duplicate.response.status, 201);
assert.equal(duplicate.json.data.viewer.isRegistered, true);

// invalid submission data is rejected before saving
const badSubmission = await request(`/competitions/${slug}/submission`, {
  method: 'POST',
  headers: { 'x-user-id': registeredUser },
  body: JSON.stringify({
    title: 'No',
    videoUrl: 'not-a-url'
  })
});
assert.equal(badSubmission.response.status, 400);

// paid registered users can submit in the seeded window
const submission = await request(`/competitions/${slug}/submission`, {
  method: 'POST',
  headers: { 'x-user-id': registeredUser },
  body: JSON.stringify({
    title: 'Kathak teen taal performance',
    videoUrl: 'https://example.com/kathak-entry.mp4',
    notes: 'Smoke test upload'
  })
});
assert.equal(submission.response.status, 200);
assert.equal(submission.json.data.viewer.submission.title, 'Kathak teen taal performance');
assert.equal(submission.json.data.viewer.primaryAction.kind, 'update_submission');

console.log('API smoke test passed.');
