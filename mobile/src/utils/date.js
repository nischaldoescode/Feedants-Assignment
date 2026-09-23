// date helpers
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: '2-digit'
});

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});

// keep labels compact like the reference screen
export function formatDateParts(value) {
  const date = new Date(value);

  return {
    date: dateFormatter.format(date).replace(',', ''),
    time: timeFormatter.format(date).replace('am', 'AM').replace('pm', 'PM')
  };
}

// return the exact countdown shape used in the banner
export function formatCountdown(ms) {
  const safeMs = Math.max(ms, 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
}

function pad(value) {
  return String(value).padStart(2, '0');
}
