import {
  getBannerApiUrl,
  insertBanner,
} from '../src/js';

import alertBannerData from '../mocks/emergency-banner.json';
import alertBannerMarkup from '../mocks/emergency-banner';
import coronavirusBannerData from '../mocks/coronavirus-banner.json';
import coronavirusBannerMarkup from '../mocks/coronavirus-banner';

describe('getBannerApiUrl()', () => {
  beforeEach(() => {
    delete window.location;
    delete window.NHSUK_SETTINGS;
    window.NHSUK_SETTINGS = {
      BANNER_API_URL: 'https://prod.api.com',
      BANNER_TEST_API_URL: 'https://test.api.com',
    };
  });

  it('returns test url if "test" query param exists', () => {
    window.location = { href: 'https://api.com/?test' };
    expect(getBannerApiUrl()).toBe('https://test.api.com');
  });

  it('returns test url if "test" exists in multiple query parameters', () => {
    window.location = { href: 'https://api.com/?example=true&test' };
    expect(getBannerApiUrl()).toBe('https://test.api.com');
  });

  it('returns test url if "test" query param does not exists', () => {
    window.location = { href: 'https://prod.api.com' };
    expect(getBannerApiUrl()).toBe('https://prod.api.com');
  });
});

describe('insertBanner()', () => {
  beforeEach(() => {
    document.body.innerHTML = `<html>
<body>
<header></header>
<footer id="nhsuk-footer"><div></div></footer>
<body>
<html>`;
  });

  it('inserts an alert banner when passed alert banner data and template', () => {
    insertBanner(alertBannerData[0]);
    const banner = document.getElementById('nhsuk-global-alert');
    expect(banner.outerHTML).toBe(alertBannerMarkup);
  });

  it('inserts the coronavirus banner when passed banner data and template', () => {
    insertBanner(coronavirusBannerData[0]);
    const banner = document.getElementById('nhsuk-global-alert');
    expect(banner.outerHTML).toBe(coronavirusBannerMarkup);
  });
});
