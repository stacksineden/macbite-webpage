/**
 * Dev-only: pins the page clock to a mid-afternoon Lagos time.
 * Without this the cart tests pass or fail depending on the hour, because the
 * site correctly stops taking orders 30 minutes before the 8pm close.
 */
export const FROZEN_ISO = '2026-09-01T13:00:00+01:00';

export async function freezeClock(page, iso = FROZEN_ISO) {
  await page.evaluateOnNewDocument((when) => {
    const fixed = new Date(when).getTime();
    const Real = Date;
    function Fake(...args) {
      return args.length ? new Real(...args) : new Real(fixed);
    }
    Fake.prototype = Real.prototype;
    Fake.now = () => fixed;
    Fake.parse = Real.parse;
    Fake.UTC = Real.UTC;
    window.Date = Fake;
  }, iso);
}
