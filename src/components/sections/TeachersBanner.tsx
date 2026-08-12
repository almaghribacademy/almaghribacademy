import "../sections-css/TeachersBanner.css";
import Link from "next/link";
export default function TeachersBanner() {
  return (
    <section className="cta-section-section">

      <div className="cta-section-container">

        <h2 className="cta-section-title">
          Learn Quran Online With Qualified & Experienced Quran Teachers
        </h2>


        <p className="cta-section-description">
          Connect with professional Quran tutors, certified Tajweed teachers,
          Arabic instructors, and Islamic studies educators who provide
          personalized online Quran classes for children and adults worldwide.
          Start your journey to improve Quran recitation, understanding, and
          Islamic knowledge from the comfort of your home.
        </p>


        {/*<button className="cta-section-button">
          Book Your Free Quran Trial Class
        </button>*/}
        <Link
              href="/trial-form"
              className={`footer-button`}>
              Book Your Free Quran Trial Class
            </Link>


      </div>

    </section>
  );
}