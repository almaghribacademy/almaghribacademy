"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import CTA from "../../src/components/sections/CTA";
import "../pages-css/faq-page.css";


const faqCategories = [
  {
    id: "general",
    name: "General Questions",
    icon: "📌",
    questions: [
      {
        id: "g1",
        question: "What is AlMaghrib Academy?",
        answer: "AlMaghrib Academy is a trusted online Islamic education platform that provides Quran reading, Tajweed, Hifz, Arabic language, and Islamic studies classes for children and adults worldwide. We offer personalized one-to-one learning with qualified male and female teachers."
      },
      {
        id: "g2",
        question: "How do I get started with AlMaghrib Academy?",
        answer: "Getting started is simple! Click the 'Book Free Trial' button, fill out a short form with your contact details and preferences, and our academic advisor will contact you within 24 hours to schedule your free trial class."
      },
      {
        id: "g3",
        question: "What makes AlMaghrib Academy different from other online Quran academies?",
        answer: "AlMaghrib Academy stands out with its personalized one-to-one approach, qualified teachers (both male and female), flexible scheduling, comprehensive curriculum, family discounts, and commitment to authentic Islamic education."
      },
      {
        id: "g4",
        question: "Where is AlMaghrib Academy based?",
        answer: "Our headquarters is based in London, UK, but our teachers and students are spread globally across the UK, USA, Canada, Middle East, and South Asia, providing a truly international learning experience."
      }
    ]
  },
  {
    id: "courses",
    name: "Courses & Programs",
    icon: "📚",
    questions: [
      {
        id: "c1",
        question: "What courses do you offer?",
        answer: "We offer comprehensive courses including: Quran Reading with Tajweed, Arabic Language Mastery, Islamic Studies & Character Building, Quran Hifz Memorization, Noorani Qaida for Beginners, and Tafseer & Quran Understanding. All courses are available for kids and adults."
      },
      {
        id: "c2",
        question: "Are the classes pre-recorded or live?",
        answer: "All our classes are 100% live and interactive, conducted one-to-one via Zoom or our portal. This ensures personalized attention and allows you to ask questions and receive instant feedback from your teacher."
      },
      {
        id: "c3",
        question: "What level are the courses suitable for?",
        answer: "Our courses cater to all levels - from complete beginners to advanced learners. We have courses for kids (ages 5+), teenagers, adults, and even seniors. Each student receives a personalized learning plan based on their current level and goals."
      },
      {
        id: "c4",
        question: "Do you offer courses for kids?",
        answer: "Yes! We have special programs designed for children that make learning Quran and Islamic studies fun, engaging, and age-appropriate. Our teachers are trained in child-friendly teaching methods."
      }
    ]
  },
  {
    id: "teachers",
    name: "Teachers & Instructors",
    icon: "👨‍🏫",
    questions: [
      {
        id: "t1",
        question: "Are your teachers qualified?",
        answer: "Yes, all our teachers are highly qualified and experienced in their respective fields. They hold certifications in Quran recitation, Tajweed, Arabic language, and Islamic studies. Many of our teachers have years of teaching experience."
      },
      {
        id: "t2",
        question: "Do you have female teachers?",
        answer: "Yes, we provide qualified female Quran teachers for sisters and young children. Our female tutors are experienced in teaching Quran reading, Tajweed, Hifz, Arabic language, and Islamic studies in a comfortable and supportive learning environment."
      },
      {
        id: "t3",
        question: "How are teachers selected?",
        answer: "All our teachers go through a rigorous selection process including qualification verification, teaching ability assessment, background checks, and trial sessions. We ensure our teachers are not only qualified but also passionate about teaching."
      },
      {
        id: "t4",
        question: "Can I change my teacher if needed?",
        answer: "Yes, if you feel the teaching style doesn't match your learning preferences, we can arrange a different teacher. We want to ensure you have the best possible learning experience."
      }
    ]
  },
  {
    id: "scheduling",
    name: "Scheduling & Flexibility",
    icon: "📅",
    questions: [
      {
        id: "s1",
        question: "How flexible are the class schedules?",
        answer: "We offer highly flexible class schedules. You can choose your preferred days and times, and we have teachers available across different time zones to fit your busy routine. Students can select timings that work best for them."
      },
      {
        id: "s2",
        question: "What if I need to reschedule a class?",
        answer: "You can reschedule classes by informing your teacher or our admin team at least 3-4 hours before the class start time. Rescheduled classes must be completed within 30 days of the current month."
      },
      {
        id: "s3",
        question: "How many classes per week?",
        answer: "The number of classes depends on the course and your preference. Most students take 2-3 classes per week, but we can adjust the frequency based on your learning goals and availability."
      },
      {
        id: "s4",
        question: "What is the duration of each class?",
        answer: "Standard class duration is 30-60 minutes per session. For younger children, we recommend 30-minute sessions, while adults typically prefer 45-60 minute sessions."
      }
    ]
  },
  {
    id: "pricing",
    name: "Pricing & Discounts",
    icon: "💰",
    questions: [
      {
        id: "p1",
        question: "What are the pricing plans?",
        answer: "We offer four pricing plans: Basic ($8/hour), Essentials ($9/hour - Best Value), Premium ($11/hour), and Platinum ($14/hour). Each plan offers different features including reschedule flexibility, progress reports, and family discounts."
      },
      {
        id: "p2",
        question: "Do you offer family discounts?",
        answer: "Yes! We offer family discounts: 5% for Premium plan families with 2+ members, and 10% for Platinum plan families with 2+ members. The discount applies to the second or subsequent student from the same family."
      },
      {
        id: "p3",
        question: "Is there a free trial?",
        answer: "Yes, we provide a free trial class where students can meet their teacher, understand our learning method, and choose the right course according to their needs. There's no obligation to continue after the trial."
      },
      {
        id: "p4",
        question: "How do I pay for classes?",
        answer: "We accept various payment methods including credit/debit cards, bank transfers, and PayPal. Our team will guide you through the payment process after you've chosen your plan."
      }
    ]
  },
  {
    id: "technical",
    name: "Technical Requirements",
    icon: "💻",
    questions: [
      {
        id: "tech1",
        question: "What do I need to start classes?",
        answer: "You'll need a stable internet connection, a computer or tablet with a camera and microphone, and a quiet space for learning. We use Zoom and our own portal for classes."
      },
      {
        id: "tech2",
        question: "Do you provide learning materials?",
        answer: "Yes, we provide e-syllabus access, learning materials, progress reports, and video recordings of your classes. All materials are tailored to your course and learning level."
      },
      {
        id: "tech3",
        question: "What if I have technical issues during class?",
        answer: "Our support team is available to help with technical issues. You can contact our admin team via WhatsApp or email, and we'll assist you promptly."
      },
      {
        id: "tech4",
        question: "Will I get a certificate?",
        answer: "Yes, upon successful completion of your course, you'll receive an e-certificate recognized by our academy. This certificate validates your learning achievement."
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Get current category questions
  const currentCategory = faqCategories.find(cat => cat.id === activeCategory);
  const questions = currentCategory?.questions || [];

  // Filter questions based on search
  const filteredQuestions = searchQuery
    ? questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Header />

      <main className="faq-page">
        {/* Hero Section */}
        <section className="faq-hero">
          <div className="faq-container">
            <span className="faq-badge">FAQ</span>
            <h1 className="faq-hero-title">
              Frequently Asked Questions
            </h1>
            <p className="faq-hero-text">
              Find answers to common questions about our courses, teachers, 
              pricing, and everything else you need to know.
            </p>
            
            {/* Search Bar */}
            <div className="faq-search">
              <input
                type="text"
                placeholder="Search your question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="faq-search-input"
              />
              <button className="faq-search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="faq-content">
          <div className="faq-container">
            <div className="faq-layout">
              {/* Categories Sidebar */}
              <aside className="faq-sidebar">
                <h3>Categories</h3>
                <ul className="faq-categories">
                  {faqCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setActiveIndex(null);
                        }}
                      >
                        <span className="category-icon">{category.icon}</span>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Questions Area */}
              <div className="faq-questions">
                <h2 className="category-title">
                  {currentCategory?.name}
                </h2>

                {filteredQuestions.length > 0 ? (
                  <div className="faq-list">
                    {filteredQuestions.map((faq, index) => (
                      <div
                        key={faq.id}
                        className={`faq-card ${activeIndex === index ? "active" : ""}`}
                      >
                        <div
                          className="faq-header"
                          onClick={() => toggleFAQ(index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleFAQ(index);
                            }
                          }}
                          aria-expanded={activeIndex === index}
                        >
                          <h3>{faq.question}</h3>
                          <span className="faq-icon">
                            {activeIndex === index ? "−" : "+"}
                          </span>
                        </div>

                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <p>No questions found matching your search.</p>
                    <button onClick={() => setSearchQuery("")}>Clear Search</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Still Have Questions? */}
        <section className="faq-contact">
          <div className="faq-container">
            <div className="contact-card">
              <h2>Still Have Questions?</h2>
              <p>
                We're here to help! Contact our support team and we'll get 
                back to you within 24 hours.
              </p>
              <div className="contact-buttons">
                <Link href="/contact" className="contact-btn primary">
                  Contact Us
                </Link>
                <a href="tel:+447488848483" className="contact-btn secondary">
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA />
      </main>

      <Footer />
    </>
  );
}