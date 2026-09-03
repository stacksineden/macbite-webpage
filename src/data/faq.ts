import { ADDRESS, PHONE_DISPLAY } from '@/config/site';
import { hoursLabel } from '@/lib/hours';

/**
 * These double as the FAQPage schema. Each one is written against a real local
 * search — "does macbite deliver", "macbite ibadan opening hours" — because
 * that is the traffic a single-location restaurant actually wins.
 */
export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Does MacBite deliver across Ibadan?',
    a: 'Yes. We deliver from Alakia and Airport Junction through Iwo Road, Bodija, Ring Road, Challenge, Dugbe and beyond. Use the delivery check on our homepage to see the fee and minimum order for your area before you start.',
  },
  {
    q: 'Where is MacBite located?',
    a: `MacBite is at ${ADDRESS.street}, ${ADDRESS.landmark.toLowerCase()}, ${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.region}.`,
  },
  {
    q: 'What time does MacBite open and close?',
    a: `The kitchen is open every day, ${hoursLabel}. Orders close shortly before 8pm so nothing lands after the kitchen has shut down.`,
  },
  {
    q: 'How do I place an order?',
    a: 'Build your order on the site — pick a base, add proteins and sides — then check out straight to WhatsApp. Your full order arrives with us as one message, and we confirm it on the same chat.',
  },
  {
    q: 'Can I order ahead and pick it up?',
    a: 'Yes. Choose pickup at checkout and your food will be packed and waiting at Cele bus stop. Pickup has no delivery fee and no minimum order.',
  },
  {
    q: 'What food does MacBite serve?',
    a: 'Rice, beans and yam porridge by the plate; amala, eba and semo with soup; chicken, beef, goat meat, turkey, assorted, ponmo, bokoto and fish as proteins; plus plantain, moin moin and coleslaw, bread and doughnuts from the pastry counter, and a full range of drinks.',
  },
  {
    q: 'Is there somewhere to sit and eat?',
    a: 'Yes. There is a sit-down dining room, a games centre upstairs, and matches on the big screen. Weekends fill up, so come early.',
  },
  {
    q: 'Does MacBite do catering?',
    a: `Yes — MacBite caters outdoor events and parties. Catering is quoted per event rather than ordered online, so call ${PHONE_DISPLAY} or message us on WhatsApp with your date, headcount and location.`,
  },
];
