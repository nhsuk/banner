import {
  getBannerApiUrl,
  getCookie,
  cookieExists,
  checkUrlArray,
  formatTime,
  formatDate,
  insertDate,
  closeSurveyBanner,
} from '../src/js/banner';

import mockAlertBanner from '../mocks/emergency-banner.json';

describe('getBannerApiUrl()', () => {
  beforeAll(() => {
    delete window.location;
    delete window.NHSUK_SETTINGS;
    window.NHSUK_SETTINGS = {
      BANNER_TEST_API_URL: 'https://test.api.com',
      BANNER_API_URL: 'https://prod.api.com',
    };
  });

  it('returns test url if window.location.href contains "test"', () => {
    window.location = { href: 'https://test.api.com' };
    expect(getBannerApiUrl()).toBe('https://test.api.com');
  });

  it('returns test url if window.location.href does not contain "test"', () => {
    window.location = { href: 'https://prod.api.com' };
    expect(getBannerApiUrl()).toBe('https://prod.api.com');
  });
});

describe('getCookie()', () => {
  const cookieName = 'nhsuk-banner-1';
  const cookieValue = 'exampleCookieContent';

  beforeAll(() => {
    delete window.document.cookie;
  });

  it('returns the value of the cookie name passed', () => {
    window.document.cookie = `${cookieName}=${cookieValue}`;
    expect(getCookie(cookieName)).toBe(cookieValue);
  });

  it('returns value of the cookie name passed with multiple banners in cookie', () => {
    window.document.cookie = `abc=123;${cookieName}=${cookieValue};xyz=123`;
    expect(getCookie(cookieName)).toBe(cookieValue);
  });

  it('returns undefined if cookie does not exist', () => {
    window.document.cookie = `${cookieName}=${cookieValue}`;
    expect(getCookie('fakeName')).toBe('');
  });
});

describe('cookieExists()', () => {
  const bannerId = '1';

  beforeAll(() => {
    delete window.document.cookie;
    window.document.cookie = `nhsuk-banner-${bannerId}=fakeValue`;
  });

  it('returns true if a value exists for the banner id passed', () => {
    expect(cookieExists(bannerId)).toBe(true);
  });

  it('returns false if a value does not exist for the banner id passed', () => {
    expect(cookieExists('12345')).toBe(false);
  });
});

describe('checkUrlArray()', () => {
  const urls = 'https://test.api.co.uk;https://test.api.com;https://test.api.uk';

  beforeAll(() => {
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

describe('formatTime()', () => {
  it('returns 12hr clock time with no spaces', () => {
    const amDateTime = new Date('2020-02-03T10:00:00.000');
    const pmDateTime = new Date('2020-02-03T22:00:00.000');
    const amResult = '10am';
    const pmResult = '10pm';
    expect(formatTime(amDateTime)).toBe(amResult);
    expect(formatTime(pmDateTime)).toBe(pmResult);
  });

  it('uses dot as separator', () => {
    const dateTime = new Date('2020-02-03T10:30:00.000');
    const result = '10.30am';
    expect(formatTime(dateTime)).toBe(result);
  });

  it('removes leading zeros from hours', () => {
    const dateTime = new Date('2020-02-03T09:30:00.000');
    const result = '9.30am';
    expect(formatTime(dateTime)).toBe(result);
  });

  it('removes minutes if zero', () => {
    const dateTime = new Date('2020-02-03T09:00:00.000');
    const result = '9am';
    expect(formatTime(dateTime)).toBe(result);
  });

  it('returns "midday" for 12pm', () => {
    const dateTime = new Date('2020-02-03T12:00:00.000');
    const result = 'midday';
    expect(formatTime(dateTime)).toBe(result);
  });

  it('returns "midnight" for 12am', () => {
    const dateTime = new Date('2020-02-03T00:00:00.000');
    const result = 'midnight';
    expect(formatTime(dateTime)).toBe(result);
  });

  it('returns input if not a valid date', () => {
    const result = 'test string!';
    expect(formatTime('test string!')).toBe(result);
    expect(formatTime('    test string!')).toBe(result);
    expect(formatTime('test string!    ')).toBe(result);
    expect(formatTime('    test string!    ')).toBe(result);
  });
});

describe('formatDate()', () => {
  it('returns date in Date, Full Month, Full Year format', () => {
    const dateTime = new Date('2020-02-03T10:00:00.000');
    const result = '3 February 2020';
    expect(formatDate(dateTime)).toBe(result);
  });

  it('returns input if not a valid date', () => {
    const result = 'test string!';
    expect(formatDate('test string!')).toBe(result);
    expect(formatDate('    test string!')).toBe(result);
    expect(formatDate('test string!    ')).toBe(result);
    expect(formatDate('    test string!    ')).toBe(result);
  });
});

describe('insertDate()', () => {
  beforeAll(() => {
    document.body.innerHTML = '<span id="last-updated"></span>';
  });

  it('sets the time and date the banner was last updated', () => {
    const dateString = '2020-02-03T10:00:00.000';
    const lastUpdated = document.getElementById('last-updated');
    insertDate(dateString);
    expect(lastUpdated.innerHTML).toBe('Last updated on: 3 February 2020 at 10am');
  });
});

describe('closeSurveyBannerBtn()', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div id="nhsuk-feedback-banner"></div>';
  });

  it('returns true if the current url is in the urls string', () => {
    const banner = document.getElementById('nhsuk-feedback-banner');
    expect(banner).toBeDefined();
    closeSurveyBanner(mockAlertBanner);
    expect(banner.style.display).toBe('none');
  });
});
