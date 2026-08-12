// app/(public)/page.tsx
"use client";
// import css from "styled-jsx/css";
import Link from 'next/link';
import Header from "../src/components/sections/Header";
import Hero from "../src/components/sections/Hero";
import Achievements from "../src/components/sections/Achievements";
import WhatWeTeach from "../src/components/sections/WhatWeTeach";
import WhyChooseUs from "../src/components/sections/WhyChooseUs";
import HowToStart from "../src/components/sections/HowToStart";
import Reviews from "../src/components/sections/Reviews";
import Teachers from "../src/components/sections/Teachers";
import TeachersBanner from "../src/components/sections/TeachersBanner";
import IslamicPractices from "../src/components/sections/IslamicPractices";
import FAQ from "../src/components/sections/FAQ";
import Blog from "../src/components/sections/Blog";
import CTA from "../src/components/sections/CTA";
import Footer from "../src/components/sections/Footer";

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