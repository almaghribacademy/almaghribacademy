"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../sections-css/Hero.css";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">
          {/* Left Content */}
          <div className={`hero-content ${isVisible ? "fade-in" : ""}`}>
            {/* Islamic Decoration */}
            <div className="hero-islamic-bg"></div>

            {/* Tagline */}
            <div className="hero-tagline-wrapper">
              <span className="hero-tagline-pill">
                <span className="pulse-dot"></span>
                ONLINE QURAN • ARABIC • ISLAMIC STUDIES
              </span>
            </div>

            {/* Main Title */}
            <h1 className="hero-title">
              Learn Quran Online
              <br />
              <span className="gradient-text">With Expert Teachers</span>
              <br />
              <span className="hero-title-highlight">Worldwide</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              Join live one-to-one Online Quran Classes, Arabic Language Courses,
              Tajweed, Hifz Program, and Islamic Studies for kids and adults.
              Learn from qualified male and female teachers with flexible schedules
              designed to strengthen faith, knowledge, and character.
            </p>

            {/* Features */}
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                Free Trial Class
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                Certified Teachers
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                Kids & Adults
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                Flexible Timings
              </div>
            </div>

            {/* Buttons */}
            <div className="hero-buttons">
              <Link href="/trial-form" className="hero-btn-primary">
                <span>Book Free Trial</span>
                <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/courses" className="hero-btn-secondary">
                <span>View Courses</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="hero-trust-badges">
              <div className="trust-item">
                <span className="trust-number">5,000+</span>
                <span className="trust-label">Students</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <span className="trust-number">4.9/5</span>
                <span className="trust-label">Rating</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <span className="trust-number">20+</span>
                <span className="trust-label">Teachers</span>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className={`hero-images ${isVisible ? "fade-in-delay" : ""}`}>
            {/* Floating Icons */}
            <div className="floating-icon icon-1">📖</div>
            <div className="floating-icon icon-2">🎓</div>
            <div className="floating-icon icon-3">🌙</div>
            <div className="floating-icon icon-4">⭐</div>

            {/* Islamic Pattern Background */}
            <div className="islamic-pattern pattern-top-left"></div>
            <div className="islamic-pattern pattern-bottom-right"></div>

            {/* Crescent Decoration */}
            <div className="crescent-decoration">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,20,147,0.15)" strokeWidth="2"/>
                <circle cx="65" cy="35" r="35" fill="none" stroke="rgba(255,20,147,0.08)" strokeWidth="2"/>
              </svg>
            </div>

            {/* Star Decorations */}
            <div className="star-decoration star-1">✦</div>
            <div className="star-decoration star-2">✦</div>
            <div className="star-decoration star-3">✦</div>

            {/* Boy Image */}
            <div className="hero-image-circle boy-image">
              <Image
                src="/assets/images/hero-boy-1.jpeg"
                alt="Islamic Learning Student"
                fill
                className="hero-image"
                sizes="280px"
                priority
              />
              <div className="image-glow"></div>
            </div>

            {/* Girl Image */}
            <div className="hero-image-circle girl-image">
              <Image
                src="/assets/images/hero-boy-2.jpeg"
                alt="Islamic Learning Student"
                fill
                className="hero-image"
                sizes="280px"
                priority
              />
              <div className="image-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}