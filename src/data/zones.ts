/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DELIVERY ZONES
 *
 *  ⚠️  BLOCKED: MacBite has not supplied zone fees. Every `fee` below is a
 *      placeholder, banded roughly by distance from Cele bus stop on Old Ife Road.
 *      Replace the numbers, add or remove areas, and the delivery check, the
 *      checkout total and the WhatsApp message all follow automatically.
 *
 *  Setting `fee: null` on a zone is supported — the customer is told the rider
 *  will confirm the fee on WhatsApp rather than being shown a wrong number.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { DEFAULT_MINIMUM_ORDER } from '@/config/site';

export interface Zone {
  id: string;
  /** Area name as an Ibadan customer would say it. */
  name: string;
  /** Extra spellings and nearby landmarks, so search finds the zone. */
  aliases?: string[];
  fee: number | null;
  /** Rough door-to-door estimate, in minutes. */
  eta: string;
  minimum?: number;
  band: 1 | 2 | 3;
}

/** Band 1 — closest to the kitchen. */
export const ZONES: Zone[] = [
  { id: 'alakia', name: 'Alakia', band: 1, fee: 700, eta: '15–25 min', aliases: ['Cele', 'Old Ife Road'] },
  { id: 'airport-junction', name: 'Airport Junction', band: 1, fee: 700, eta: '15–25 min', aliases: ['Airport'] },
  { id: 'egbeda', name: 'Egbeda', band: 1, fee: 900, eta: '20–30 min' },
  { id: 'olodo', name: 'Olodo', band: 1, fee: 900, eta: '20–30 min' },
  { id: 'monatan', name: 'Monatan', band: 1, fee: 900, eta: '20–30 min' },

  { id: 'iwo-road', name: 'Iwo Road', band: 2, fee: 1200, eta: '25–40 min' },
  { id: 'basorun', name: 'Basorun', band: 2, fee: 1200, eta: '25–40 min', aliases: ['Bashorun'] },
  { id: 'akobo', name: 'Akobo', band: 2, fee: 1400, eta: '30–45 min' },
  { id: 'gate', name: 'Gate', band: 2, fee: 1200, eta: '25–40 min', aliases: ['Agodi Gate'] },
  { id: 'agodi', name: 'Agodi', band: 2, fee: 1300, eta: '30–45 min' },
  { id: 'ojoo', name: 'Ojoo', band: 2, fee: 1500, eta: '35–50 min' },
  { id: 'bodija', name: 'Bodija', band: 2, fee: 1500, eta: '30–45 min', aliases: ['New Bodija', 'Old Bodija'] },
  { id: 'university-of-ibadan', name: 'University of Ibadan', band: 2, fee: 1500, eta: '35–50 min', aliases: ['UI', 'Ui', 'Unibadan'] },
  { id: 'mokola', name: 'Mokola', band: 2, fee: 1500, eta: '35–50 min' },
  { id: 'sango', name: 'Sango', band: 2, fee: 1700, eta: '40–55 min' },

  { id: 'ring-road', name: 'Ring Road', band: 3, fee: 1800, eta: '40–55 min' },
  { id: 'challenge', name: 'Challenge', band: 3, fee: 1800, eta: '40–60 min' },
  { id: 'dugbe', name: 'Dugbe', band: 3, fee: 1800, eta: '40–60 min' },
  { id: 'jericho', name: 'Jericho', band: 3, fee: 2000, eta: '45–60 min' },
  { id: 'eleyele', name: 'Eleyele', band: 3, fee: 2000, eta: '45–60 min' },
  { id: 'oluyole', name: 'Oluyole', band: 3, fee: 2000, eta: '45–60 min' },
  { id: 'apata', name: 'Apata', band: 3, fee: 2200, eta: '50–70 min' },
  { id: 'moniya', name: 'Moniya', band: 3, fee: 2200, eta: '50–70 min' },
];

export const BAND_LABEL: Record<Zone['band'], string> = {
  1: 'Closest to the kitchen',
  2: 'Central Ibadan',
  3: 'Across town',
};

export const zoneById = (id: string): Zone | undefined => ZONES.find((z) => z.id === id);

export const minimumFor = (zone: Zone): number => zone.minimum ?? DEFAULT_MINIMUM_ORDER;

/** Fuzzy-ish area lookup used by the homepage delivery check. */
export function searchZones(q: string): Zone[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return ZONES.filter((z) =>
    z.name.toLowerCase().includes(term) || z.aliases?.some((a) => a.toLowerCase().includes(term)),
  ).slice(0, 6);
}
