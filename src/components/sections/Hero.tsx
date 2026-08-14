import Image from "next/image";
import Link from "next/link";
import "../sections-css/Hero.css";
export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">

          {/* Content */}
          <div className="hero-content">

            {/* Background Islamic Pattern */}
            <div className="hero-islamic-bg"></div>

            <span className="hero-tagline">
              ONLINE QURAN • <span className="pink-text">ARABIC</span> • ISLAMIC STUDIES
            </span>

            <h1 className="hero-title">
              Learn Quran Online
              <br />
              <span className="pink-text">With Expert Teachers</span>
              <br />
              Worldwide
            </h1>

            <p className="hero-description">
              Join live one-to-one Online Quran Classes, Arabic Language Courses,
              Tajweed, Hifz Program, and Islamic Studies for kids and adults.
              Learn from qualified male and female teachers with flexible schedules
              designed to strengthen faith, knowledge, and character.
            </p>

            <div className="hero-features">
              <span>✓ Free Trial Class</span>
              <span>✓ Certified Teachers</span>
              <span>✓ Kids & Adults</span>
              <span>✓ Flexible Timings</span>
            </div>
            
            <div className="hero-buttons">

            <Link
              href="/register"
              className={`hero-btn-primary`}
            >
              Book Free Trial
            </Link>
              {/*<button className="hero-btn-primary">
                Book Free Trial
              </button>*/}

              {/*<button className="hero-btn-secondary">
                View Courses
              </button>*/}
            <Link
              href="/courses"
              className={`hero-btn-secondary`}
            >
              View Courses
            </Link>
            </div>
          </div>

          {/* Images Section */}
          <div className="hero-images">

            {/* Islamic Decorations */}
            <div className="islamic-pattern pattern-top-left"></div>
            <div className="islamic-pattern pattern-bottom-right"></div>

            <div className="crescent-decoration"></div>

            <div className="star-decoration star-1">✦</div>
            <div className="star-decoration star-2">✦</div>
            <div className="star-decoration star-3">✦</div>

            {/* Boy Image */}
            <div className="hero-image-circle boy-image">
              <Image
                src="/assets/images/hero-1.jpg"
                alt="Islamic Learning Student"
                fill
                className="hero-image"
                sizes="280px"
                priority
              />
            </div>

            {/* Girl Image */}
            <div className="hero-image-circle girl-image">
              <Image
                src="/assets/images/hero-2.png"
                alt="Islamic Learning Student"
                fill
                className="hero-image"
                sizes="280px"
                priority
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}