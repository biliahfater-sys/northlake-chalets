import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Collection } from "@/components/sections/collection";
import { Contact } from "@/components/sections/contact";
import { Dossier } from "@/components/sections/dossier";
import { Faq } from "@/components/sections/faq";
import { GrandQuote } from "@/components/sections/grand-quote";
import { Hero } from "@/components/sections/hero";
import { Investment } from "@/components/sections/investment";
import { Manifesto } from "@/components/sections/manifesto";
import { Marquee } from "@/components/sections/marquee";
import { Materials } from "@/components/sections/materials";
import { NatureQuote } from "@/components/sections/nature-quote";
import { Platform } from "@/components/sections/platform";
import { Process } from "@/components/sections/process";
import { SeasonalPlates } from "@/components/sections/seasonal-plates";
import { Trust } from "@/components/sections/trust";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Collection />
        <Dossier />
        <NatureQuote />
        <Materials />
        <SeasonalPlates />
        <Investment />
        <Process />
        <Platform />
        <Faq />
        <Trust />
        <GrandQuote />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
