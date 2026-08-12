import "../sections-css/CTA.css";
import Link from "next/link";
export default function CTA() {
  return (
    <section className="cta-section">

      <div className="cta-container">

        <h2 className="cta-title">
          Start Learning Quran Online With Qualified Teachers Today
        </h2>


        <p className="cta-description">
          Join thousands of students worldwide who are learning Quran,
          Tajweed, Arabic, and Islamic studies through personalized online
          classes with experienced Quran teachers. Begin your Quran learning
          journey with a free trial class today.
        </p>


        <div className="cta-buttons">

          {/*<button className="btn-primary">
            Book Your Free Quran Trial
          </button>*/}

          <Link href="/trial-form" className="btn-primary">
            <span>Book Your Free Quran Trial</span>
          </Link>

          
          {/*<button className="btn-secondary">
            Contact Our Quran Academy
          </button>*/}
          
          <Link href="/contact" className="btn-secondary">
            <span>Contact Our Quran Academy</span>
          </Link>

        </div>


      </div>

    </section>
  );
}