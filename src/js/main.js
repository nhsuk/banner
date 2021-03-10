import './polyfills';

/**
 * HTML for emergency banner
 */
const template = `<div class="nhsuk-global-alert" id="nhsuk-global-alert" role="complementary">
<div class="nhsuk-width-container">
<div class="nhsuk-grid-row">
<div class="nhsuk-grid-column-full">
<div class="nhsuk-global-alert__content">
<div class="nhsuk-global-alert__message">[Content]</div>
</div></div></div></div></div>`;

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
 * Insert the alert, survey and invitation banner HTML in to DOM and attach event handlers.
 * Headers are not the same all over because they are using an outdated version of the
 * frontend library.
 * @param {object} bannerApiData
 * @returns {void}
 */
export function insertBanner(bannerApiData) {
  // Build HTML from templates using banner data
  const bannerDiv = document.createElement('div');
  // Replaces any [key] in the template with content from the banner api
  bannerDiv.innerHTML = template.replace(/\[(\w*)\]/g,
    (_, key) => (bannerApiData[key] || ''));
  // Insert emergency banner below header
  const [headerEl] = document.getElementsByTagName('header');
  headerEl.parentElement.insertBefore(bannerDiv.firstChild, headerEl.nextElementSibling);
}

document.addEventListener('DOMContentLoaded', () => {
  const bannerApiUrl = getBannerApiUrl();
  const request = new XMLHttpRequest();
  request.open('GET', bannerApiUrl, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        // Look for an Alert banner
        const banner = data.find(({ Style }) => Style === 'Alert');
        // Insert an Alert banner if it is found
        if (banner) insertBanner(banner);
      }
    }
  };

  request.send();
});
