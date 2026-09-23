// rule tests

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canCancelRegistration,
  getLifecycle,
  getPrimaryAction,
  getSpotSnapshot
} from '../src/domain/competitionRules.js';

const baseCompetition = {
  status: 'published',
  totalSpots: 20,
  bookedSpots: 1,
  timeline: {
    registrationOpensAt: new Date('2026-08-01T03:30:00.000Z'),
    registrationClosesAt: new Date('2026-08-10T18:20:00.000Z'),
    submissionStartsAt: new Date('2026-08-06T22:30:00.000Z'),
    submissionEndsAt: new Date('2026-08-30T18:25:00.000Z'),
    resultAt: new Date('2026-09-01T18:20:00.000Z')
  }
};

// avoid mutating shared dates between tests
function competitionWith(overrides = {}) {
  return {
    ...baseCompetition,
    ...overrides,
    timeline: {
      ...baseCompetition.timeline,
      ...(overrides.timeline || {})
    }
  };
}

test('registration and submission can overlap', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-08T10:00:00.000Z'));

  assert.equal(lifecycle.phase, 'submission_open');
  assert.equal(lifecycle.registration.isOpen, true);
  assert.equal(lifecycle.submission.isOpen, true);
});

test('spots are bounded and expose progress', () => {
  const spots = getSpotSnapshot(20, 24);

  assert.equal(spots.booked, 20);
  assert.equal(spots.left, 0);
  assert.equal(spots.isFull, true);
  assert.equal(spots.bookedPercent, 100);
});

test('registered paid user can upload during submission window', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-08T10:00:00.000Z'));
  const spots = getSpotSnapshot(20, 1);
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots,
    participation: { status: 'registered', paymentStatus: 'paid' },
    submission: null
  });

  assert.deepEqual(primaryAction, {
    kind: 'upload_submission',
    label: 'Upload Submission',
    disabled: false,
    reason: null
  });
});

test('full competition blocks new registration', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-04T10:00:00.000Z'));
  const spots = getSpotSnapshot(20, 20);
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots,
    participation: null,
    submission: null
  });

  assert.equal(primaryAction.kind, 'full');
  assert.equal(primaryAction.disabled, true);
});

test('submitted registration cannot be cancelled', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-08T10:00:00.000Z'));
  const cancellation = canCancelRegistration({
    lifecycle,
    participation: { status: 'submitted' },
    submission: { title: 'My Dance' }
  });

  assert.equal(cancellation.allowed, false);
});

test('draft competition is unavailable', () => {
  const lifecycle = getLifecycle(
    competitionWith({ status: 'draft' }),
    new Date('2026-08-04T10:00:00.000Z')
  );
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 0),
    participation: null,
    submission: null
  });

  assert.equal(lifecycle.phase, 'unavailable');
  assert.equal(primaryAction.kind, 'unavailable');
  assert.equal(primaryAction.disabled, true);
});

test('future registration shows not open action', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-07-28T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 0),
    participation: null,
    submission: null
  });

  assert.equal(lifecycle.phase, 'upcoming');
  assert.equal(primaryAction.kind, 'not_open');
});

test('open registration allows new user to register', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-03T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 3),
    participation: null,
    submission: null
  });

  assert.equal(lifecycle.phase, 'registration_open');
  assert.equal(primaryAction.kind, 'register');
  assert.equal(primaryAction.disabled, false);
});

test('closed registration blocks new users before results', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-31T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 12),
    participation: null,
    submission: null
  });

  assert.equal(lifecycle.phase, 'judging');
  assert.equal(primaryAction.kind, 'closed');
  assert.equal(primaryAction.disabled, true);
});

test('results state opens the results action', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-09-02T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 20),
    participation: { status: 'registered', paymentStatus: 'paid' },
    submission: null
  });

  assert.equal(lifecycle.phase, 'results_declared');
  assert.equal(primaryAction.kind, 'view_results');
  assert.equal(primaryAction.disabled, false);
});

test('unpaid registered user gets payment action', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-08T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 1),
    participation: { status: 'registered', paymentStatus: 'pending' },
    submission: null
  });

  assert.equal(primaryAction.kind, 'complete_payment');
  assert.equal(primaryAction.disabled, false);
});

test('existing submission changes upload into update', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-08T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 1),
    participation: { status: 'submitted', paymentStatus: 'paid' },
    submission: { title: 'Kathak entry' }
  });

  assert.equal(primaryAction.kind, 'update_submission');
  assert.equal(primaryAction.disabled, false);
});

test('registered user waits before submission opens', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-04T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 2),
    participation: { status: 'registered', paymentStatus: 'paid' },
    submission: null
  });

  assert.equal(primaryAction.kind, 'registered_waiting');
  assert.equal(primaryAction.disabled, true);
});

test('registered user cannot upload during judging', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-31T10:00:00.000Z'));
  const primaryAction = getPrimaryAction({
    lifecycle,
    spots: getSpotSnapshot(20, 2),
    participation: { status: 'registered', paymentStatus: 'paid' },
    submission: null
  });

  assert.equal(primaryAction.kind, 'judging');
  assert.equal(primaryAction.disabled, true);
});

test('active registration can be cancelled before submission starts', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-04T10:00:00.000Z'));
  const cancellation = canCancelRegistration({
    lifecycle,
    participation: { status: 'registered' },
    submission: null
  });

  assert.equal(cancellation.allowed, true);
});

test('cancellation closes once submission starts', () => {
  const lifecycle = getLifecycle(baseCompetition, new Date('2026-08-08T10:00:00.000Z'));
  const cancellation = canCancelRegistration({
    lifecycle,
    participation: { status: 'registered' },
    submission: null
  });

  assert.equal(cancellation.allowed, false);
});

test('zero capacity snapshot is safe', () => {
  const spots = getSpotSnapshot(0, -4);

  assert.equal(spots.total, 0);
  assert.equal(spots.booked, 0);
  assert.equal(spots.left, 0);
  assert.equal(spots.bookedPercent, 0);
});
