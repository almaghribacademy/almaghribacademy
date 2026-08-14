import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import Link from "next/link";
import "../globals.css";
import "../pages-css/about.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AlMaghrib Academy",
  description:
    "Learn about AlMaghrib Academy, our mission, vision, qualified Quran teachers, and our commitment to providing quality online Quran education.",
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="about-page">

        {/* Hero Section */}
        <section className="about-hero">

          <div className="about-container">

            <span className="about-badge">
              ABOUT AlMaghrib ACADEMY
            </span>

            <h1 className="about-hero-title">
              Inspiring Lifelong Learning Through
              <span> Quran, Arabic & Islamic Education</span>
            </h1>

            <p className="about-hero-text">
              AlMaghrib Academy is dedicated to providing high-quality
              online Quran, Arabic, and Islamic Studies education
              for students of all ages worldwide.
            </p>

          </div>

        </section>



        {/* Story Section */}
        <section className="story-section">

          <div className="about-container">

            <div className="story-grid">

              <div className="story-content">

                <h2>Our Story</h2>

                <p>
                  AlMaghrib Academy was established with a simple mission:
                  to make authentic Islamic education accessible to
                  students around the world.
                </p>

                <p>
                  Through modern technology and experienced teachers,
                  we help students build a strong relationship with
                  the Quran while developing Islamic values and character.
                </p>

              </div>

              <div className="story-image">
                📖
              </div>

            </div>

          </div>

        </section>



        {/* Mission Vision */}
        <section className="mission-section">

          <div className="about-container">

            <div className="mission-grid">

              <div className="mission-card">

                <div className="mission-icon">
                  🎯
                </div>

                <h3>Our Mission</h3>

                <p>
                  To provide accessible, engaging and authentic
                  Islamic education for Muslims worldwide.
                </p>

              </div>

              <div className="mission-card">

                <div className="mission-icon">
                  👁️
                </div>

                <h3>Our Vision</h3>

                <p>
                  To become a leading global platform for Quranic
                  and Islamic learning.
                </p>

              </div>

              <div className="mission-card">

                <div className="mission-icon">
                  ❤️
                </div>

                <h3>Our Values</h3>

                <p>
                  Excellence, sincerity, integrity and a commitment
                  to nurturing strong Islamic character.
                </p>

              </div>

            </div>

          </div>

        </section>



        {/* Stats */}
        <section className="stats-section">

          <div className="about-container">

            <div className="stats-grid">

              <div className="stat-card">
                <h3>99+</h3>
                <p>Students</p>
              </div>

              <div className="stat-card">
                <h3>20+</h3>
                <p>Qualified Teachers</p>
              </div>

              <div className="stat-card">
                <h3>25+</h3>
                <p>Countries</p>
              </div>

              <div className="stat-card">
                <h3>10+</h3>
                <p>Years Experience</p>
              </div>

            </div>

          </div>

        </section>



      {/* CTA */}
        <section className="about-cta">

          <div className="about-container">

            <h2>
              Begin Your Quran Learning Journey Today
            </h2>

            <p>
              Join thousands of students learning with expert teachers.
            </p>

            {/*<button className="about-btn">
              Book Free Trial
            </button>*/}

            <Link href="/register">
              <button className="about-btn">
                Book Free Trial
              </button>
            </Link>

          </div>

        </section>

        {/* Why Choose Us */}
        <section className="why-section">

          <div className="about-container">

            <h2 className="section-title">
              Why Choose AlMaghrib Academy?
            </h2>

            <div className="why-grid">

              <div className="why-card">
                <h3>Qualified Teachers</h3>
                <p>
                  Learn from experienced scholars and certified instructors.
                </p>
              </div>

              <div className="why-card">
                <h3>Flexible Schedule</h3>
                <p>
                  Study from anywhere with timings that suit your lifestyle.
                </p>
              </div>

              <div className="why-card">
                <h3>One-to-One Classes</h3>
                <p>
                  Personalized learning plans for every student.
                </p>
              </div>

            </div>

          </div>

        </section>





      </main>

      <Footer />
    </>
  );
}