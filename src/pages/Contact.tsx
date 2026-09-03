import { Seo } from '@/lib/seo';
import { restaurantSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import { FAQS } from '@/data/faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { FindUs } from '@/components/home/FindUs';
import { Faq } from '@/components/home/Faq';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { whatsappEnquiry } from '@/lib/whatsapp';
import { PHONE_DISPLAY, PHONE_TEL, ADDRESS } from '@/config/site';
import { hoursLabel } from '@/lib/hours';

const WAYS = [
  { title: 'WhatsApp', body: 'Fastest way to reach the kitchen. Orders, questions, catering.', cta: 'Message us', to: whatsappEnquiry('I have a question.') },
  { title: 'Call', body: 'Straight through to the counter during opening hours.', cta: PHONE_DISPLAY, to: `tel:${PHONE_TEL}` },
  { title: 'Walk in', body: `${ADDRESS.street}. Open every day, ${hoursLabel}.`, cta: 'Get directions', to: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`MacBite, ${ADDRESS.street}, ${ADDRESS.area}, ${ADDRESS.city}, Nigeria`)}` },
];

export default function Contact() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }];

  return (
    <>
      <Seo
        title="Contact &amp; directions"
        description={`Reach MacBite at ${ADDRESS.street}, ${ADDRESS.area}, Ibadan. Open every day ${hoursLabel}. Call ${PHONE_DISPLAY} or message us on WhatsApp.`}
        path="/contact"
        jsonLd={[restaurantSchema(), breadcrumbSchema(crumbs), faqSchema(FAQS)]}
      />

      <PageHeader
        eyebrow="Contact"
        title="Come in, call, or message."
        lead="However you reach us, someone's on the other end during opening hours."
        crumbs={crumbs}
      />

      <div className="shell pb-16">
        <ul className="grid gap-5 sm:grid-cols-3">
          {WAYS.map((w, i) => (
            <Reveal as="li" key={w.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-lift ring-1 ring-ink/8">
                <h2 className="font-display text-2xl font-800 text-ink">{w.title}</h2>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-3">{w.body}</p>
                <ButtonLink to={w.to} variant="outline" size="md" className="mt-6 w-full" arrow>{w.cta}</ButtonLink>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <FindUs />
      <Faq />
    </>
  );
}
