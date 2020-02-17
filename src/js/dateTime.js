/**
 * Get a formatted time from a js date object.
 * @param {date} date
 * @returns {string} formatted time
 */
export function formatTime(date) {
  if (date instanceof Date) {
    return date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
      .replace(':00', '')
      .replace(':', '.')
      .replace(' ', '')
      .replace('12AM', 'midnight')
      .replace('12PM', 'midday')
      .toLowerCase();
  }
  return date.trim();
}

/**
   * Add the last updated date to the alert banner.
   * @param {date} date
   * @returns {string} formatted date
   */
export function formatDate(date) {
  if (date instanceof Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  return date.trim();
}

/**
   * Add the last updated date to the alert banner.
   * @param {string} dateString
   * @returns {undefined}
   */
export function insertDate(dateString) {
  const lastUpdatedElem = document.getElementById('last-updated');
  if (lastUpdatedElem) {
    const dateIso = new Date(dateString);
    lastUpdatedElem.textContent = `Last updated on: ${formatDate(dateIso)} at ${formatTime(dateIso)}`;
  }
}
