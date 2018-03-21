export function AddSeconds (currentDate: number, secs: number) {
  return currentDate + (1000 * secs);
}

export function AddMinutes (currentDate: number, minutes: number) {
  return AddSeconds(currentDate, minutes * 60);
}

export function AddHours (currentDate: number, hours: number) {
  return AddMinutes(currentDate, hours * 60);
}

export function AddDays (currentDate: number, days: number) {
  return AddHours(currentDate, days * 24);
}