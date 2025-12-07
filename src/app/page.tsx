import Hero from '@/components/Hero';
import AboutImpact from '@/components/AboutImpact';
import ProgramsCarousel from '@/components/ProgramsCarousel';
import Villages from '@/components/Villages';
import Support from '@/components/Support';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <AboutImpact />
      <ProgramsCarousel />
      <Villages />
      <Support />
      <Footer />
    </main>
  );
}
