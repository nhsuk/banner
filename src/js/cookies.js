/**
 * Get the cookie value with the given name.
 * @param {string} cookieName Name of the cookie to find
 * @returns {string} An empty string if the cookie was not found, the value of the cookie if it was.
 */
export function getCookie(cookieName) {
  const cookieObj = decodeURIComponent(document.cookie)
    .split('; ')
    .reduce((obj, cookie) => {
      const [key, value] = cookie.split('=');
      return {
        ...obj,
        [key.trim()]: value,
      };
    }, {});
  return cookieObj[cookieName] || '';
}

/**
 * Sets a cookie that will expire in numberOfDays for a specified bannerId.
 * @param {string} bannerId
 * @param {int} numberOfDays The cookie will expire in numberOfDays from the current date.
 * @returns {void}
 */
export function setCookie(bannerId, numberOfDays) {
  const dateObj = new Date();
  dateObj.setTime(dateObj.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
  document.cookie = `nhsuk-banner-${bannerId}=true;expires=${dateObj.toUTCString()};path=/`;
}

/**
 * Checks to see if a cookie with the specific name exists, if it does then the banner was
 * previously closed or the survey was taken.
 * @param {string} bannerId The banner id.
 * @returns {bool} returns true if a cookie was previously set, returns false if it was not.
 */
export function cookieExists(bannerId) {
  return Boolean(getCookie(`nhsuk-banner-${bannerId}`));
}
