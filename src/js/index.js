import './polyfills';
import { cookieExists, setCookie } from './cookies';
import { feedbackBannerStr, emergencyBannerStr } from './templates';
import { insertDate } from './dateTime';

/**
 * Get relevant API URL based off current URL
 * @returns {string} Banner API URL.
 */
export function getBannerApiUrl() {
  // Test returns true if "test" query param exists
  return (/[?&]test/.test(window.location.href))
    ? window.NHSUK_SETTINGS.BANNER_TEST_API_URL
    : window.NHSUK_SETTINGS.BANNER_API_URL;
}

/**
 * Click event handler to hide the survey banner on the current page.
 * @returns {void}
 */
export function hideBanner() {
  document.getElementById('nhsuk-feedback-banner').setAttribute('style', 'display: none');
}

/**
 * Check to see if the current url matches any of the urls the survey should be included
 * on or excluded from.
 * @param {string} urls colon separated list of urls to include/exclude a survey banner from.
 * @returns {bool} true if a match is found false if not.
 */
export function checkUrlArray(urls) {
  const currentUrl = window.location.href.toLowerCase();
  return urls.toLowerCase()
    .split(';')
    .includes(currentUrl);
}

/**
 * Check if the current url is in the list of matched urls in the api data.
 * @param {string} excludeUrls list of urls that the survey banner should not appear on.
 * @param {string} includeUrls list of urls that the survey banner should appear on.
 * @returns {bool} True if the url is matched, If includeUrl is empty it is included on all pages.
 * False if it should not be included.
 */

export function isMatchedUrl(excludedUrls, includedUrls) {
  // Return false if current url is excluded
  if (checkUrlArray(excludedUrls)) return false;
  // Is includedUrls empty or does it contain the current url
  return (includedUrls.length === 0 || checkUrlArray(includedUrls));
}

/**
 * Check to see if the banner is valid for the current page.
 * @param {Object} bannerApiData
 * @returns {bool} true if banner is valid false if it is not.
 */
export function bannerIsValid(bannerApiData) {
  const { Including, Excluding, BannerId } = bannerApiData;
  // Return false if banner has been dismissed or completed
  if (cookieExists(BannerId)) return false;
  // Should banner be displayed based on current url and excluded / included url lists
  return (isMatchedUrl(Excluding, Including));
}

/**
 * Insert the alert, survey and invitation banner HTML in to DOM and attach event handlers.
 * Headers are not the same all over because they are using an outdated version of the
 * frontend library.
 * The refElement targets the first nav on the page and inserts the banner before the next sibling.
 * @param {object} bannerApiData
 * @returns {undefined}
 */
export function insertBanner(bannerApiData) {
  // Build HTML from templates using banner data
  const bannerDiv = document.createElement('div');
  const bannerTemplate = bannerApiData.Style === 'Alert' ? emergencyBannerStr : feedbackBannerStr;
  // Replaces any [key] in the template with content from the banner api
  bannerDiv.innerHTML = bannerTemplate.replace(/\[(\w*)\]/g,
    (_, key) => (bannerApiData[key] || ''));

  if (bannerApiData.Style === 'Alert') {
    // Insert emergency banner below header
    const headerEl = document.getElementsByTagName('header');
    headerEl[0].parentElement.insertBefore(bannerDiv.firstChild, headerEl[0].nextElementSibling);
    insertDate(bannerApiData.CreatedDate);
  } else if (bannerApiData.Style === 'Default') {
    // Insert feedback banner in footer
    bannerDiv.firstChild.style.display = 'block';
    const footerEl = document.getElementById('nhsuk-footer');
    setTimeout(() => {
      footerEl.insertBefore(bannerDiv.firstChild, footerEl.childNodes[0]);

      // Add event listeners to feedback banner buttons
      document.getElementById('DisagreeButton').addEventListener('click', (e) => {
        e.preventDefault();
        hideBanner();
        setCookie(bannerApiData.BannerId, 99);
      }, false);

      document.getElementById('AgreeButton').addEventListener('click', () => {
        hideBanner();
        setCookie(bannerApiData.BannerId, 99);
      }, false);

      document.getElementById('nhsuk-feedback-banner-close').addEventListener('click', () => {
        hideBanner();
      }, false);
    }, 3000);
  }
}

/**
 * Check if a banner is valid for the current page (alert banners are valid for all pages)
 * @param {array} apiResponseDataArray
 * @returns {void}
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
    insertBanner(banner);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bannerApiUrl = getBannerApiUrl();

  const request = new XMLHttpRequest();
  request.open('GET', bannerApiUrl, true);
  request.addEventListener('load', () => {
    const data = JSON.parse(request.responseText);
    processBanners(data);
  });
  request.send();
});
