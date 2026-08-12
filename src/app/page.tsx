import Header from "../components/sections/Header";
import Hero from "../components/sections/Hero";
import Achievements from "../components/sections/Achievements";
import WhatWeTeach from "../components/sections/WhatWeTeach";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import HowToStart from "../components/sections/HowToStart";
import Reviews from "../components/sections/Reviews";
import Teachers from "../components/sections/Teachers";
import TeachersBanner from "../components/sections/TeachersBanner";
import IslamicPractices from "../components/sections/IslamicPractices";
import FAQ from "../components/sections/FAQ";
import Blog from "../components/sections/Blog";
import CTA from "../components/sections/CTA";
import Footer from "../components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Achievements />
      <WhatWeTeach />
      <WhyChooseUs />
      <HowToStart />
      <Reviews />
      <Teachers />
      <TeachersBanner />
      <IslamicPractices />
      <FAQ />
      <Blog />
      <CTA />
      <Footer />
    </>
  );
}