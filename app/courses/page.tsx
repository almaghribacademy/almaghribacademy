import Link from "next/link";

// ✅ From app/courses/page.tsx to ../src/components/sections/
// Go up 3 levels: ../../../src/components/sections/
import Header from "../../src/components/sections/Header";
import Achievements from "../../src/components/sections/Achievements";
import WhatWeTeach from "../../src/components/sections/WhatWeTeach";
import WhyChooseUs from "../../src/components/sections/WhyChooseUs";
import HowToStart from "../../src/components/sections/HowToStart";
import Reviews from "../../src/components/sections/Reviews";
import Teachers from "../../src/components/sections/Teachers";
import TeachersBanner from "../../src/components/sections/TeachersBanner";
import IslamicPractices from "../../src/components/sections/IslamicPractices";
import FAQ from "../../src/components/sections/FAQ";
import Blog from "../../src/components/sections/Blog";
import CTA from "../../src/components/sections/CTA";
import Footer from "../../src/components/sections/Footer";

// ✅ From app/courses/page.tsx to app/pages-css/
// Go up 2 levels: ../pages-css/
import "../pages-css/courses.css";
import "../pages-css/course-details.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Quran Courses | AlMaghrib Academy",
  description:
    "Explore our online Quran, Tajweed, Hifz, Arabic, and Islamic Studies courses for kids and adults.",
};


// Course data with full details
export const courses = [
  {
    id: 1,
    title: "Quran Learning with Tajweed",
    slug: "quran-learning-with-tajweed",
    description: "Learn the Holy Quran with proper Tajweed rules, accurate pronunciation, and beautiful recitation techniques.",
    fullDescription: "This comprehensive course is designed to help students master the art of Quran recitation with proper Tajweed rules...",
    duration: "6 Months",
    level: "Beginner to Intermediate",
    classes: "2-3 Classes Per Week",
    mode: "Online One-to-One",
    certificate: "Yes",
    modules: [
      "Module 1: Introduction to Arabic Letters & Sounds",
      "Module 2: Basic Tajweed Rules (Makharij & Sifaat)",
      "Module 3: Rules of Noon Sakinah & Tanween",
      "Module 4: Rules of Meem Sakinah",
      "Module 5: Advanced Tajweed Rules",
      "Module 6: Practical Recitation & Assessment"
    ],
    learningOutcomes: [
      "Correct Arabic Pronunciation",
      "Mastery of Tajweed Rules",
      "Fluency in Quran Reading",
      "Confidence in Recitation",
      "Daily Quran Practice",
      "Recitation Assessment & Feedback"
    ],
    icon: "📖",
    badge: "QURAN",
    color: "card4"
  },
  {
    id: 2,
    title: "Arabic Language Mastery",
    slug: "arabic-language-mastery",
    description: "Master Arabic reading, writing, speaking, and comprehension skills through structured and interactive lessons.",
    fullDescription: "Our Arabic Language Mastery course is designed to help students develop comprehensive Arabic language skills...",
    duration: "8 Months",
    level: "Beginner to Advanced",
    classes: "3 Classes Per Week",
    mode: "Online One-to-One",
    certificate: "Yes",
    modules: [
      "Module 1: Arabic Alphabet & Pronunciation",
      "Module 2: Basic Vocabulary & Phrases",
      "Module 3: Arabic Grammar Essentials",
      "Module 4: Reading & Writing Skills",
      "Module 5: Advanced Grammar & Composition",
      "Module 6: Conversational Arabic"
    ],
    learningOutcomes: [
      "Master Arabic Alphabet",
      "Build Strong Vocabulary",
      "Understand Arabic Grammar",
      "Read & Write Fluently",
      "Speak with Confidence",
      "Comprehend Quranic Arabic"
    ],
    icon: "ض",
    badge: "ARABIC",
    color: "card3"
  },
  {
    id: 3,
    title: "Islamic Studies & Character Building",
    slug: "islamic-studies-character",
    description: "Gain authentic Islamic knowledge while developing excellent character, manners, and strong moral values.",
    fullDescription: "This course provides a comprehensive understanding of Islamic teachings, values, and practices...",
    duration: "6 Months",
    level: "All Levels",
    classes: "2 Classes Per Week",
    mode: "Online One-to-One",
    certificate: "Yes",
    modules: [
      "Module 1: Islamic Beliefs (Aqeedah)",
      "Module 2: Islamic Practices (Fiqh)",
      "Module 3: Hadith & Sunnah",
      "Module 4: Seerah (Life of Prophet Muhammad)",
      "Module 5: Islamic Manners & Etiquette",
      "Module 6: Contemporary Islamic Issues"
    ],
    learningOutcomes: [
      "Understand Islamic Beliefs",
      "Learn Islamic Practices",
      "Study Hadith & Sunnah",
      "Know the Seerah",
      "Develop Islamic Manners",
      "Apply Islamic Values"
    ],
    icon: "☾",
    badge: "ISLAMIC",
    color: "card5"
  },
  {
    id: 4,
    title: "Quran Hifz Memorization Program",
    slug: "quran-hifz-memorization",
    description: "Memorize the Holy Quran through a guided Hifz program with regular revision and personalized teacher support.",
    fullDescription: "Our Hifz program provides a structured approach to memorizing the Holy Quran...",
    duration: "Customized (2-5 Years)",
    level: "Intermediate",
    classes: "3-5 Classes Per Week",
    mode: "Online One-to-One",
    certificate: "Yes",
    modules: [
      "Module 1: Memorization Techniques",
      "Module 2: Juz 1-5",
      "Module 3: Juz 6-10",
      "Module 4: Juz 11-15",
      "Module 5: Juz 16-20",
      "Module 6: Juz 21-30 & Revision"
    ],
    learningOutcomes: [
      "Memorize Quran with Tajweed",
      "Strong Memorization Techniques",
      "Regular Revision & Assessment",
      "Develop Spiritual Connection",
      "Build Memorization Skills",
      "Complete Hifz Certification"
    ],
    icon: "📖",
    badge: "HIFZ",
    color: "card6"
  },
  {
    id: 5,
    title: "Noorani Qaida for Beginners",
    slug: "noorani-qaida-beginners",
    description: "Build a strong Quranic foundation by learning Arabic letters, pronunciation, and essential Tajweed principles.",
    fullDescription: "The Noorani Qaida course is designed for beginners who want to learn the basics of Quran reading...",
    duration: "3 Months",
    level: "Beginner",
    classes: "2 Classes Per Week",
    mode: "Online One-to-One",
    certificate: "Yes",
    modules: [
      "Module 1: Arabic Alphabet Introduction",
      "Module 2: Letter Sounds & Pronunciation",
      "Module 3: Harakat (Vowels)",
      "Module 4: Basic Tajweed Rules",
      "Module 5: Joining Letters & Words",
      "Module 6: Reading Practice"
    ],
    learningOutcomes: [
      "Identify Arabic Letters",
      "Correct Pronunciation",
      "Apply Basic Tajweed",
      "Join Letters & Words",
      "Read Simple Quran Verses",
      "Build Quran Reading Foundation"
    ],
    icon: "📚",
    badge: "QAIDA",
    color: "card1"
  },
  {
    id: 6,
    title: "Tafseer & Quran Understanding",
    slug: "tafseer-quran-understanding",
    description: "Understand the meanings, wisdom, and practical teachings of the Holy Quran through authentic Tafseer studies.",
    fullDescription: "This course provides an in-depth study of the meanings and teachings of the Holy Quran...",
    duration: "8 Months",
    level: "Intermediate to Advanced",
    classes: "2 Classes Per Week",
    mode: "Online One-to-One",
    certificate: "Yes",
    modules: [
      "Module 1: Introduction to Tafseer",
      "Module 2: Understanding Quranic Themes",
      "Module 3: Context of Revelation (Asbab al-Nuzul)",
      "Module 4: Detailed Tafseer of Selected Surahs",
      "Module 5: Quranic Wisdom & Lessons",
      "Module 6: Practical Application"
    ],
    learningOutcomes: [
      "Understand Quranic Meanings",
      "Learn Context of Revelation",
      "Study Authentic Tafseer",
      "Apply Quranic Wisdom",
      "Deepen Quranic Knowledge",
      "Build a Connection with the Quran"
    ],
    icon: "📖",
    badge: "TAFSEER",
    color: "card2"
  }
];

export default function CoursesPage() {
  return (
    <>
      <Header />

      <main className="course-page">
        {/* Hero */}
        <section className="courses-hero">
          <div className="courses-container">
            <h1 className="courses-hero-title">Our Courses</h1>
            <p className="courses-hero-text">
              Learn Quran, Arabic and Islamic Studies with qualified
              teachers through structured one-to-one online classes.
            </p>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="courses-section">
          <div className="courses-container">
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className={`course-card ${course.color}`}>
                  <div className="course-icon">{course.icon}</div>
                  <span className="course-badge">{course.badge}</span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <Link href={`/courses/${course.slug}`} className="course-button">
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Achievements />
        <WhyChooseUs />
        <HowToStart />
        <Reviews />
        <Teachers />
        <TeachersBanner />
        <IslamicPractices />
        <FAQ />
        <Blog />
        <CTA />
      </main>

      <Footer />
    </>
  );
}