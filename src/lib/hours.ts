import { HOURS, CUTOFF_MINUTES_BEFORE_CLOSE, BREAKFAST_ENABLED } from '@/config/site';

export type DayPartKey = 'breakfast' | 'lunch' | 'dinner';

/** West Africa Time. The kitchen's clock, not the visitor's. */
const TZ = 'Africa/Lagos';

export function lagosNow(now: Date = new Date()): { hour: number; minute: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return { hour, minute, minutes: hour * 60 + minute };
}

export function isOpen(now?: Date): boolean {
  const { hour } = lagosNow(now);
  return hour >= HOURS.open && hour < HOURS.close;
}

/** Orders stop before the kitchen does, so nothing lands after they shut down. */
export function isAcceptingOrders(now?: Date): boolean {
  const { minutes } = lagosNow(now);
  return minutes >= HOURS.open * 60 && minutes < HOURS.close * 60 - CUTOFF_MINUTES_BEFORE_CLOSE;
}

export function currentDayPart(now?: Date): DayPartKey {
  const { hour } = lagosNow(now);
  if (BREAKFAST_ENABLED && hour < 11) return 'breakfast';
  if (hour < 16) return 'lunch';
  return 'dinner';
}

const pad = (n: number) => String(n).padStart(2, '0');
export const hoursLabel = `${HOURS.open}am – ${HOURS.close - 12}pm`;
export const opensAtLabel = `${HOURS.open}:00am`;
export const closesAtLabel = `${HOURS.close - 12}:00pm`;
/** ISO-ish opening hours for schema.org. */
export const schemaHours = `Mo-Su ${pad(HOURS.open)}:00-${pad(HOURS.close)}:00`;
