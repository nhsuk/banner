import {
  getCookie,
  cookieExists,
  setCookie,
} from '../src/js/cookies';

const bannerId = 1;
const cookieName = `nhsuk-banner-${bannerId}`;

afterEach(() => {
  document.cookie = `${cookieName}=; Max-Age=-99999999;`;
});

describe('getCookie()', () => {
  it('returns the value of the cookie name passed', () => {
    document.cookie = `${cookieName}=true`;
    expect(getCookie(cookieName)).toBe('true');
  });

  it('returns undefined if cookie does not exist', () => {
    document.cookie = `${cookieName}=true`;
    expect(getCookie('fakeName')).toBe('');
  });
});

describe('cookieExists()', () => {
  beforeEach(() => {
    document.cookie = `nhsuk-banner-${bannerId}=true`;
  });

  it('returns true if a value exists for the banner id passed', () => {
    expect(cookieExists(bannerId)).toBe(true);
  });

  it('returns false if a value does not exist for the banner id passed', () => {
    expect(cookieExists('fake-cookie-name')).toBe(false);
  });
});

describe('setCookie()', () => {
  it('sets a cookie for the passed banner', () => {
    setCookie(bannerId, 99);
    expect(cookieExists(bannerId)).toBe(true);
  });
});
