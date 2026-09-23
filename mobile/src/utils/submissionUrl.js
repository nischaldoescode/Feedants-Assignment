// submission url checks
export function isValidSubmissionUrl(value) {
  const trimmed = value.trim();

  if (trimmed.length > 500) {
    return false;
  }

  try {
    const url = new URL(trimmed);

    // only browser reachable links are accepted
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    return Boolean(url.hostname && url.hostname.includes('.'));
  } catch {
    return false;
  }
}
