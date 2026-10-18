import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import ContactDrawer from './components/ContactDrawer';
import Examples from './components/Examples';
import Faq from './components/Faq';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import Growth from './components/Growth';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Process from './components/Process';
import Showreel from './components/Showreel';
import WhyMe from './components/WhyMe';
import { startSmoothScroll } from './lib/motion';

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  useEffect(() => startSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <Nav onContact={openContact} />
      <main>
        <Hero onContact={openContact} />
        <Showreel />
        <Growth />
        <Examples />
        <WhyMe />
        <Process />
        <Faq />
        <FinalCta onContact={openContact} />
      </main>
      <Footer />
      <ContactDrawer open={contactOpen} onClose={closeContact} />
    </MotionConfig>
  );
}
