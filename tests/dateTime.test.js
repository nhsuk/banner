import { formatTime, formatDate, insertDate } from '../src/js/dateTime';

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
  beforeEach(() => {
    document.body.innerHTML = '<span id="last-updated"></span>';
  });

  it('sets the time and date the banner was last updated', () => {
    const dateString = '2020-02-03T10:00:00.000';
    const lastUpdated = document.getElementById('last-updated');
    insertDate(dateString);
    expect(lastUpdated.innerHTML).toBe('Last updated on: 3 February 2020 at 10am');
  });
});
