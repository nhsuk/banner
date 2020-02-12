export const surveyBannerStr = `<div class='nhsuk-feedback-banner' id='nhsuk-feedback-banner'>
<div class='nhsuk-width-container'>
<div class='nhsuk-grid-row'>
<div class='nhsuk-grid-column-full'>
<div class='nhsuk-feedback-banner__content'>
<h2 class='nhsuk-feedback-banner__heading'>[Invitation1]</h2>
<p class='nhsuk-feedback-banner__message nhsuk-u-margin-bottom-2'>
<a href='[BannerUrl]' id='AgreeButton' target='_blank'>Take our survey (opens new page)</a>
</p>
<p class='nhsuk-feedback-banner__message nhsuk-u-margin-bottom-4'>
<a href='#' id='DisagreeButton'>I do not want to take this survey</a>
</p>
<p class='nhsuk-u-margin-bottom-0'>We'll use a cookie to save your choice.</p>
<button class='nhsuk-feedback-banner__close' id='nhsuk-feedback-banner-close' type='button'>Hide<span class='nhsuk-u-visually-hidden'> feedback invite</span></button>
</div>
</div>
</div>
</div>
</div>`;

export const alertBannerStr = `<div class='nhsuk-global-alert' id='nhsuk-global-alert'>
<div class='nhsuk-width-container'>
<div class='nhsuk-grid-row'>
<div class='nhsuk-grid-column-full'>
<div class='nhsuk-global-alert__content'>
<p class='nhsuk-global-alert__message'>[Content]</p>
<p id='last-updated' class='nhsuk-global-alert__updated'></p>
</div>
</div>
</div>
</div>
</div >`;

/**
 * Find out if we are in test mode and return relevant api url.
 * @returns {string} banner api url.
 */
export function getBannerApiUrl() {
  return window.location.href.includes('test')
    ? window.NHSUK_SETTINGS.BANNER_TEST_API_URL
    : window.NHSUK_SETTINGS.BANNER_API_URL;
}

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
 * Checks to see if a cookie with the specific name exists, if it does then the banner was
 * previously closed or the survey was taken.
 * @param {string} bannerId The banner id.
 * @returns {bool} returns true if a cookie was previously set, returns false if it was not.
 */
export function cookieExists(bannerId) {
  return Boolean(getCookie(`nhsuk-banner-${bannerId}`));
}

/**
 * Check to see if the current url matches any of the urls the survey should be included
 * on or excluded from.
 * @param {string} urls colon separated list of urls to include/exclude a survey banner from.
 * @returns {bool} true if a match is found false if not.
 */
export function checkUrlArray(urls) {
  const currentUrl = window.location.href.toLowerCase();
  const urlArray = urls.toLowerCase().split(';');
  return Boolean(urlArray.find((url) => url === currentUrl));
}

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

/**
 * Sets a cookie that will expire in numberOfDays for a specified bannerId.
 * @param {string} bannerId
 * @param {int} numberOfDays The cookie will expire in numberOfDays from the current date.
 * @returns {void}
 */
export function setCookie(bannerId, numberOfDays) {
  const dateObj = new Date();
  dateObj.setTime(dateObj.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
  window.document.cookie = `nhsuk-banner-${bannerId}=true;expires=${dateObj.toUTCString()};path=/`;
}

/**
   * Click event handler to hide the survey banner on the current page.
   * @returns {void}
   */
function hideSurveyBanner() {
  document.getElementById('nhsuk-feedback-banner').setAttribute('style', 'display: none');
}

/**
 * Click event handler to remove the survey banner form the page.
 * @param {object} bannerApiData
 * @returns {void}
 */
export function closeSurveyBanner(bannerApiData) {
  hideSurveyBanner();
  setCookie(bannerApiData.BannerId, 99);
}

/**
 * Click event handler for take survey button.
 * @param {object} bannerApiData
 * @returns {void}
 */
function takeSurvey(bannerApiData) {
  hideSurveyBanner();
  setCookie(bannerApiData.BannerId, 99);
}

/**
 * Chose the correct banner type and replace placeholders.
 * @param {object} bannerApiData The object containing the data that
 * will be replaced in to the template.
 * @returns {string} The template string with substitutions made.
 */
function formatBannerAsElement(bannerApiData) {
  const bannerTemplate = bannerApiData.Style === 'Alert' ? alertBannerStr : surveyBannerStr;
  // Replaces any [key] in the template with content from the banner api
  return bannerTemplate.replace(/\[(\w*)\]/g,
    (_, key) => (bannerApiData[key] || ''));
}

/**
 * Insert the alert, survey and invitation banner HTML in to DOM and attach event handlers.
 * Headers are not the same all over because they are using an outdated version of the
 * frontend library.
 * The refElement targets the first nav on the page and inserts the banner before the next sibling.
 * @param {object} bannerApiData
 * @param {string} bannerElString Contains the HTML that will be inserted in to the DOM.
 * @returns {undefined}
 */
function insertBanner(bannerApiData, bannerElString) {
  const bannerDiv = document.createElement('div');
  bannerDiv.innerHTML = bannerElString;

  if (bannerApiData.Style === 'Alert') {
    const headerEl = document.getElementsByTagName('header');
    headerEl[0].parentElement.insertBefore(bannerDiv.firstChild, headerEl[0].nextElementSibling);
    insertDate(bannerApiData.CreatedDate);
  } else if (bannerApiData.Style === 'Default') {
    bannerDiv.firstChild.style.display = 'block';
    const footerEl = document.getElementById('nhsuk-footer');
    setTimeout(() => {
      footerEl.insertBefore(bannerDiv.firstChild, footerEl.childNodes[0]);
      document.getElementById('DisagreeButton').addEventListener('click', (e) => {
        e.preventDefault();
        closeSurveyBanner(bannerApiData);
      }, false);
      document.getElementById('AgreeButton').addEventListener('click', () => {
        takeSurvey(bannerApiData);
      }, false);
      document.getElementById('nhsuk-feedback-banner-close').addEventListener('click', () => {
        hideSurveyBanner();
      }, false);
    }, 3000);
  }
}

/**
 * Check if the current url is in the list of matched urls in the api data.
 * @param {string} excludeUrls Contains a list of pages that the survey banner should not appear on.
 * @param {string} includeUrls Contains a list of pages that the survey banner should appear on.
 * @returns {bool} True if the url is matched, If includeUrl is empty it is included on all pages.
 * False if it should not be included.
 */
function isMatchedUrl(excludedUrls, includedUrls) {
  if (excludedUrls.length && checkUrlArray(excludedUrls)) {
    return false;
  }
  if (includedUrls.length === 0) {
    return true;
  }
  if (checkUrlArray(includedUrls)) {
    return true;
  }
  return false;
}

/**
 * Check to see if the banner is valid for the current page.
 * @param {string} includeUrls Semi colon separated list of urls the banner will be included on.
 * @param {string} excludeUrls Semi colon separated list of urls the banner will be excluded from.
 * @param {string} bannerId Id of the banner.
 * @returns {bool} true if banner is valid false if it is not.
 */
function bannerIsValid({ Including, Excluding, BannerId }) {
  if (cookieExists(BannerId)) return false;
  if (isMatchedUrl(Excluding, Including)) return true;
  return false;
}

/**
 * Check if a banner is valid for the current page (alert banners are valid for all pages)
 * @param {array} apiResponseDataArray
 * @returns {undefined}
 */
function processBanners(banners) {
  // Check for alert banner (all are valid)
  let banner = banners.find(({ Style }) => Style === 'Alert');

  // If no alert banner look for valid default banners
  if (!banner) {
    const defaultBanner = banners.find(({ Style }) => Style === 'Default');
    if (defaultBanner && bannerIsValid(defaultBanner)) banner = defaultBanner;
  }

  // If any kind of banner insert it
  if (banner) {
    const bannerElString = formatBannerAsElement(banner);
    insertBanner(banner, bannerElString);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bannerApiUrl = getBannerApiUrl();

  const request = new XMLHttpRequest();
  request.open('GET', bannerApiUrl, true);
  request.addEventListener('load', () => {
    try {
      const data = JSON.parse(request.responseText);
      processBanners(data);
    } catch (err) {
      processBanners([]);
    }
  });
  request.send();
});
