import { Seo } from '@/lib/seo';
import { SITE } from '@/config/site';
import { restaurantSchema, websiteSchema, faqSchema } from '@/lib/schema';
import { FAQS } from '@/data/faq';
import { Hero } from '@/components/home/Hero';
import { DeliveryCheck } from '@/components/home/DeliveryCheck';
import { DayParts } from '@/components/home/DayParts';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Popular } from '@/components/home/Popular';
import { TheRoom } from '@/components/home/TheRoom';
import { FindUs } from '@/components/home/FindUs';
import { Faq } from '@/components/home/Faq';

export default function Home() {
  return (
    <>
      <Seo
        title={SITE.name}
        description={SITE.description}
        path="/"
        jsonLd={[restaurantSchema(), websiteSchema(), faqSchema(FAQS)]}
      />
      <Hero />
      <DeliveryCheck />
      <DayParts />
      <Popular />
      <HowItWorks />
      <TheRoom />
      <FindUs />
      <Faq />
    </>
  );
}
