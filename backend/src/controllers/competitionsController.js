// competition handlers
import {
  cancelRegistration,
  getCompetitionDetail,
  registerForCompetition,
  submitEntry
} from '../services/competitionService.js';

// return a complete screen payload
export async function showCompetition(req, res) {
  const payload = await getCompetitionDetail({
    key: req.params.key,
    userId: req.userId
  });

  res.json({ ok: true, data: payload });
}

// book one participant spot
export async function register(req, res) {
  const payload = await registerForCompetition({
    key: req.params.key,
    userId: req.userId,
    input: req.body
  });

  res.status(201).json({ ok: true, data: payload });
}

// release a booked spot when allowed
export async function cancel(req, res) {
  const payload = await cancelRegistration({
    key: req.params.key,
    userId: req.userId
  });

  res.json({ ok: true, data: payload });
}

// save the user performance entry
export async function submit(req, res) {
  const payload = await submitEntry({
    key: req.params.key,
    userId: req.userId,
    input: req.body
  });

  res.json({ ok: true, data: payload });
}
