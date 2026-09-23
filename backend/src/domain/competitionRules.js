// competition rules
const activeStatuses = new Set(['registered', 'submitted']);

// keep spot math honest for every caller
export function getSpotSnapshot(totalSpots, bookedSpots) {
  const total = Math.max(Number(totalSpots) || 0, 0);
  const booked = Math.min(Math.max(Number(bookedSpots) || 0, 0), total);
  const left = Math.max(total - booked, 0);

  return {
    total,
    booked,
    left,
    isFull: left === 0,
    bookedPercent: total === 0 ? 0 : Math.round((booked / total) * 100)
  };
}

// convert dates into one clear phase
export function getLifecycle(competition, now = new Date()) {
  const timeline = competition.timeline;
  const current = new Date(now);
  const registrationOpensAt = new Date(timeline.registrationOpensAt);
  const registrationClosesAt = new Date(timeline.registrationClosesAt);
  const submissionStartsAt = new Date(timeline.submissionStartsAt);
  const submissionEndsAt = new Date(timeline.submissionEndsAt);
  const resultAt = new Date(timeline.resultAt);
  const isPublished = competition.status === 'published';

  // draft or cancelled screens cannot take action
  if (!isPublished) {
    return {
      phase: 'unavailable',
      isAvailable: false,
      registration: { isOpen: false, hasOpened: false, hasClosed: false },
      submission: { isOpen: false, hasStarted: false, hasClosed: false },
      results: { isDeclared: false },
      nextMilestoneAt: null
    };
  }

  const registration = {
    isOpen: current >= registrationOpensAt && current <= registrationClosesAt,
    hasOpened: current >= registrationOpensAt,
    hasClosed: current > registrationClosesAt,
    opensAt: registrationOpensAt,
    closesAt: registrationClosesAt,
    closesInMs: Math.max(registrationClosesAt.getTime() - current.getTime(), 0)
  };

  const submission = {
    isOpen: current >= submissionStartsAt && current <= submissionEndsAt,
    hasStarted: current >= submissionStartsAt,
    hasClosed: current > submissionEndsAt,
    startsAt: submissionStartsAt,
    endsAt: submissionEndsAt
  };

  const results = {
    isDeclared: current >= resultAt,
    resultAt
  };

  let phase = 'upcoming';
  let nextMilestoneAt = registrationOpensAt;

  // later phases win when windows overlap
  if (results.isDeclared) {
    phase = 'results_declared';
    nextMilestoneAt = null;
  } else if (submission.hasClosed) {
    phase = 'judging';
    nextMilestoneAt = resultAt;
  } else if (submission.isOpen) {
    phase = 'submission_open';
    nextMilestoneAt = submissionEndsAt;
  } else if (registration.isOpen) {
    phase = 'registration_open';
    nextMilestoneAt = registrationClosesAt;
  }

  return {
    phase,
    isAvailable: true,
    registration,
    submission,
    results,
    nextMilestoneAt
  };
}

// the app trusts this for the main button
export function getPrimaryAction({ lifecycle, spots, participation, submission }) {
  const isRegistered = participation && activeStatuses.has(participation.status);

  if (!lifecycle.isAvailable) {
    return action('unavailable', 'Unavailable', true, 'Competition is not available right now.');
  }

  if (lifecycle.results.isDeclared) {
    return action('view_results', 'View Results', false);
  }

  if (isRegistered) {
    if (participation.paymentStatus !== 'paid') {
      return action('complete_payment', 'Complete Payment', false);
    }

    if (lifecycle.submission.isOpen) {
      return submission
        ? action('update_submission', 'Update Submission', false)
        : action('upload_submission', 'Upload Submission', false);
    }

    if (lifecycle.submission.hasClosed) {
      return action('judging', 'Judging In Progress', true, 'Submissions are closed.');
    }

    return action('registered_waiting', 'Registered', true, 'Submission window has not opened yet.');
  }

  if (spots.isFull) {
    return action('full', 'Join Waitlist', true, 'All participation spots are booked.');
  }

  if (lifecycle.registration.isOpen) {
    return action('register', 'Register Now', false);
  }

  if (!lifecycle.registration.hasOpened) {
    return action('not_open', 'Registration Soon', true, 'Registration has not opened yet.');
  }

  return action('closed', 'Registration Closed', true, 'Registration is closed.');
}

// cancellation is strict after a real entry exists
export function canCancelRegistration({ lifecycle, participation, submission }) {
  if (!participation || !activeStatuses.has(participation.status)) {
    return { allowed: false, reason: 'No active registration found.' };
  }

  if (submission || participation.status === 'submitted') {
    return { allowed: false, reason: 'Submitted entries cannot be cancelled.' };
  }

  if (lifecycle.submission.hasStarted) {
    return { allowed: false, reason: 'Cancellation closes once submissions start.' };
  }

  if (lifecycle.registration.hasClosed) {
    return { allowed: false, reason: 'Registration window is already closed.' };
  }

  return { allowed: true, reason: null };
}

// tiny cta object for the client
function action(kind, label, disabled, reason = null) {
  return { kind, label, disabled, reason };
}
