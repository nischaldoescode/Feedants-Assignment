// competition data hook

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  cancelRegistration,
  fetchCompetition,
  registerForCompetition,
  submitCompetitionEntry
} from '../api/client';
import { config } from '../config/env';

// keep api state close to the screen
export function useCompetition() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // load the latest competition data
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCompetition(config.competitionSlug);
      setPayload(data);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, []);

  // load data when the hook mounts
  useEffect(() => {
    reload();
  }, [reload]);

  // run an api action and refresh state
  const runAction = useCallback(async (action, body) => {
    setBusy(true);
    setError(null);

    try {
      const data = await action(config.competitionSlug, body);
      setPayload(data);
      return data;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setBusy(false);
    }
  }, []);

  // expose competition actions
  const actions = useMemo(() => ({
    register: (body) => runAction(registerForCompetition, body),
    cancel: () => runAction(cancelRegistration),
    submit: (body) => runAction(submitCompetitionEntry, body)
  }), [runAction]);

  return {
    payload,
    loading,
    busy,
    error,
    reload,
    actions
  };
}