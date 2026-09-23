// api client
import { config } from '../config/env';

// normalize api errors for the screen
async function request(path, options = {}) {
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-user-id': config.userId,
      ...(options.headers || {})
    }
  });

  const json = await response.json();

  // backend errors carry a stable code
  if (!response.ok || !json.ok) {
    const error = new Error(json.error?.message || 'Request failed');
    error.code = json.error?.code;
    error.details = json.error?.details;
    throw error;
  }

  return json.data;
}

// fetch full screen payload in one request
export function fetchCompetition(slug) {
  return request(`/competitions/${slug}`);
}

// registration stays server owned
export function registerForCompetition(slug, payload) {
  return request(`/competitions/${slug}/register`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// cancellation is allowed only while rules permit it
export function cancelRegistration(slug) {
  return request(`/competitions/${slug}/register`, {
    method: 'DELETE'
  });
}

// upload and update share the same endpoint
export function submitCompetitionEntry(slug, payload) {
  return request(`/competitions/${slug}/submission`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
