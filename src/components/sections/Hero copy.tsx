import { Play } from "lucide-react";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">

          <div className="hero-content">
            <span className="hero-tagline">
              KNOWLEDGE • <span className="pink-text">CHARACTER</span> • PURPOSE
            </span>

            <h1 className="hero-title">
              Small Steps Today,
              <br />
              <span className="pink-text">Endless Rewards</span>
              <br />
              Forever.
            </h1>

            <p className="hero-description">
              Expert-led Qur'an, Islamic Studies, and Arabic Language classes
              designed to nurture faith, character, and confidence.
            </p>

            <div className="hero-buttons">
              <button className="hero-btn-primary">
                Book Free Trial
              </button>

              <button className="hero-btn-secondary">
                Enroll Now
              </button>
            </div>
          </div>

         {/* <div className="hero-images">
            <div className="hero-image-circle boy-image">
              <Image
                src="/assets/images/boy-1.png"
                alt="Islamic Learning Student"
                fill
                className="hero-image"
                priority
              />
            </div>

            <div className="hero-image-circle girl-image">
              <Image
                src="/assets/images/girl-1-1-Photoroom.png"
                alt="Islamic Learning Student"
                fill
                className="hero-image"
                priority
              />
            </div>
          </div>*/}
          <div className="hero-images">

  <div className="floating-icon icon-1">📖</div>
  <div className="floating-icon icon-2">🎓</div>
  <div className="floating-icon icon-3">🌙</div>
  <div className="floating-icon icon-4">⭐</div>

  <div className="hero-image-circle boy-image">
    <Image
      src="/assets/images/boy-1.png"
      alt="Student"
      fill
      className="hero-image"
      priority
    />
  </div>

  <div className="hero-image-circle girl-image">
    <Image
      src="/assets/images/girl-1-1-Photoroom.png"
      alt="Student"
      fill
      className="hero-image"
      priority
    />
  </div>

</div>
        </div>
      </div>
    </section>
  );
}