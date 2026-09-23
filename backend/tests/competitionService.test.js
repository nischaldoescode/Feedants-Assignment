// service tests

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSeatReservationFilter,
  buildSeatReservationUpdate,
  submissionInputSchema
} from '../src/services/competitionService.js';

test('seat reservation filter protects capacity and duplicate users', () => {
  const now = new Date('2026-08-04T10:00:00.000Z');
  const filter = buildSeatReservationFilter({
    competitionId: 'competition-id',
    userId: 'user-1',
    now
  });

  assert.equal(filter._id, 'competition-id');
  assert.equal(filter.status, 'published');
  assert.deepEqual(filter.registeredUserIds, { $ne: 'user-1' });
  assert.deepEqual(filter.$expr, { $lt: ['$bookedSpots', '$totalSpots'] });
  assert.deepEqual(filter['timeline.registrationOpensAt'], { $lte: now });
  assert.deepEqual(filter['timeline.registrationClosesAt'], { $gte: now });
});

test('seat reservation update increments and marks user atomically', () => {
  const update = buildSeatReservationUpdate('user-1');

  assert.deepEqual(update, {
    $inc: { bookedSpots: 1 },
    $addToSet: { registeredUserIds: 'user-1' }
  });
});

test('submission input accepts clean https links', () => {
  const payload = submissionInputSchema.parse({
    title: 'Kathak teen taal performance',
    videoUrl: 'https://example.com/video.mp4',
    notes: 'Ready for judging'
  });

  assert.equal(payload.videoUrl, 'https://example.com/video.mp4');
});

test('submission input rejects non http video links', () => {
  assert.throws(() => {
    submissionInputSchema.parse({
      title: 'Kathak teen taal performance',
      videoUrl: 'ftp://example.com/video.mp4'
    });
  }, /Video link must be a valid http or https URL/);
});

test('submission input rejects hostless urls', () => {
  assert.throws(() => {
    submissionInputSchema.parse({
      title: 'Kathak teen taal performance',
      videoUrl: 'https://localhost'
    });
  }, /Video link must be a valid http or https URL/);
});
