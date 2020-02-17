import {
  getBannerApiUrl,
  hideBanner,
  checkUrlArray,
  isMatchedUrl,
  bannerIsValid,
  insertBanner,
} from '../src/js';

import { setCookie } from '../src/js/cookies';
import alertBannerData from '../mocks/emergency-banner.json';
import alertBannerMarkup from '../mocks/emergency-banner';
import feedbackBannerData from '../mocks/feedback-banner.json';
import feedbackBannerMarkup from '../mocks/feedback-banner';

describe('getBannerApiUrl()', () => {
  beforeEach(() => {
    delete window.location;
    delete window.NHSUK_SETTINGS;
    window.NHSUK_SETTINGS = {
      BANNER_TEST_API_URL: 'https://test.api.com',
      BANNER_API_URL: 'https://prod.api.com',
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

describe('checkUrlArray()', () => {
  const urls = 'https://test.api.co.uk;https://test.api.com;https://test.api.uk';

  beforeEach(() => {
    delete window.location;
  });

  it('returns true if the current url is in the urls string', () => {
    window.location = { href: 'https://test.api.com' };
    expect(checkUrlArray(urls)).toBe(true);
  });

  it('returns false if the current url is not in the urls string', () => {
    window.location = { href: 'https://fake.api.com' };
    expect(checkUrlArray(urls)).toBe(false);
  });
});

describe('hideBanner()', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="nhsuk-feedback-banner"></div>';
  });

  it('hides the survey banner using CSS', () => {
    const banner = document.getElementById('nhsuk-feedback-banner');
    expect(banner).toBeDefined();
    hideBanner();
    expect(banner.style.display).toBe('none');
  });
});

describe('checkUrlArray()', () => {
  const urls = 'https://test0.com/;https://test1.com/;https://test2.com/';

  it('returns true if the current url is in the semi colon separated list of urls', () => {
    window.location = { href: 'https://test1.com/' };
    expect(checkUrlArray(urls)).toBe(true);
  });

  it('returns false if the current url is not in the semi colon separated list of urls', () => {
    window.location = { href: 'https://test3.com/' };
    expect(checkUrlArray(urls)).toBe(false);
  });
});

describe('isMatchedUrl()', () => {
  const excludedUrls = 'https://test0.com/;https://test1.com/';
  const includedUrls = 'https://test2.com/;https://test3.com/';

  it('returns false if the current url is an excluded url', () => {
    window.location = { href: 'https://test0.com/' };
    expect(isMatchedUrl(excludedUrls, includedUrls)).toBe(false);
  });

  it('returns false if the current url is not included when other urls are included', () => {
    window.location = { href: 'https://test4.com/' };
    expect(isMatchedUrl('', includedUrls)).toBe(false);
  });

  it('returns true if the current url is not excluded and included is empty', () => {
    window.location = { href: 'https://test2.com/' };
    expect(isMatchedUrl('', '')).toBe(true);
  });

  it('returns true if the current url is not excluded and is included', () => {
    window.location = { href: 'https://test2.com/' };
    expect(isMatchedUrl('', includedUrls)).toBe(true);
  });
});

describe('bannerIsValid()', () => {
  const bannerApiData = {
    Excluding: 'https://test0.com/;https://test1.com/',
    Including: 'https://test2.com/;https://test3.com/',
    BannerId: 1,
  };

  it('returns false if the current url is an excluded url', () => {
    window.location = { href: 'https://test0.com/' };
    expect(bannerIsValid(bannerApiData)).toBe(false);
  });

  it('returns false if the current url is not included when other urls are included', () => {
    window.location = { href: 'https://test4.com/' };
    expect(bannerIsValid({
      ...bannerApiData,
      excludedUrls: '',
    })).toBe(false);
  });

  it('returns true if the current url is not excluded and included is empty', () => {
    window.location = { href: 'https://test2.com/' };
    expect(bannerIsValid({
      ...bannerApiData,
      excludedUrls: '',
      includedUrls: '',
    })).toBe(true);
  });

  it('returns true if the current url is not excluded and is included', () => {
    window.location = { href: 'https://test2.com/' };
    expect(bannerIsValid({
      ...bannerApiData,
      excludedUrls: '',
    })).toBe(true);
  });

  it('returns false if a cookie is set for the banner', () => {
    window.location = { href: 'https://test2.com/' };
    setCookie(bannerApiData.BannerId, 99);
    expect(bannerIsValid(bannerApiData)).toBe(false);
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
    insertBanner(alertBannerData[0], alertBannerMarkup);
    const banner = document.getElementById('nhsuk-global-alert');
    expect(banner.outerHTML).toBe(alertBannerMarkup);
  });

  it('inserts an feedback banner when passed feedback banner data and template', () => {
    jest.useFakeTimers();
    insertBanner(feedbackBannerData[0], feedbackBannerMarkup);
    jest.advanceTimersByTime(3000);
    const banner = document.getElementById('nhsuk-feedback-banner');
    expect(banner.outerHTML).toBe(feedbackBannerMarkup);
  });
});
