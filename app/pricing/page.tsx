import Link from "next/link";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import FAQ from "../../src/components/sections/FAQ";
import CTA from "../../src/components/sections/CTA";
import "../pages-css/pricing.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans | AlMaghrib Academy",
  description:
    "Choose an affordable online Quran learning plan that fits your schedule and educational goals.",
};

export default function PricingPage() {
  return (
    <>
      <Header />

      <main className="pricing-page">
        {/* Hero Section */}
        <section className="pricing-hero">
          <div className="pricing-container">
            <span className="pricing-badge">Pricing</span>
            <h1 className="pricing-hero-title">Plans That Fit Your Family</h1>
            <p className="pricing-hero-text">
              Flexible, affordable plans with family discounts. Quality Quranic education 
              that fits your budget and supports your spiritual journey.
            </p>
            <div className="pricing-hero-features">
              <span>✓ Discover the Perfect Plan for You</span>
              <span>✓ Transparency You Can Trust</span>
              <span>✓ No Hidden Fees</span>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="pricing-plans">
          <div className="pricing-container">
            <div className="pricing-grid">
              {/* Basic Plan */}
              <div className="pricing-card basic">
                <div className="plan-header">
                  <h3 className="plan-name">Basic</h3>
                  <p className="plan-subtitle">Entry Level Package</p>
                  <div className="plan-price">
                    $8.00 <span>/hour</span>
                  </div>
                </div>
                <ul className="plan-features">
                  <li>✓ Proficient Arabic (Native) Teacher</li>
                  <li>✓ E-Certificate</li>
                  <li>✓ E-Syllabus Access</li>
                  <li>✓ Direct Chat with Teacher and Coach</li>
                  <li>✓ Lesson Reschedules</li>
                  <li>✓ Coaching and Planning Sessions</li>
                  <li>✓ Progress Report</li>
                  <li>✓ Lesson Cancellation</li>
                  <li>✓ Family Discount</li>
                  <li>✓ Top 5 Star Rated Teacher</li>
                  <li>✓ Video Recordings</li>
                </ul>
                <Link href="/trial-form" className="plan-button">
                  Book Free Trial
                </Link>
              </div>

              {/* Essentials Plan */}
              <div className="pricing-card essentials featured">
                <div className="featured-badge">Best Value</div>
                <div className="plan-header">
                  <h3 className="plan-name">Essentials</h3>
                  <p className="plan-subtitle">Core Feature Set</p>
                  <div className="plan-price">
                    $9.00 <span>/hour</span>
                  </div>
                </div>
                <ul className="plan-features">
                  <li>✓ Proficient Arabic (Native) Teacher</li>
                  <li>✓ E-Certificate</li>
                  <li>✓ E-Syllabus Access</li>
                  <li>✓ Direct Chat with Teacher and Coach</li>
                  <li>✓ Up to 2 Lesson Reschedules per Month*</li>
                  <li>✓ Coaching and Planning Sessions</li>
                  <li>✓ Progress Report</li>
                  <li>✓ Lesson Cancellation</li>
                  <li>✓ Family Discounts</li>
                  <li>✓ Top 5 Star Rated Teacher</li>
                  <li>✓ Video Recordings</li>
                </ul>
                <Link href="/trial-form" className="plan-button">
                  Book Free Trial
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="pricing-card premium">
                <div className="plan-header">
                  <h3 className="plan-name">Premium</h3>
                  <p className="plan-subtitle">Advanced Benefits</p>
                  <div className="plan-price">
                    $11.00 <span>/hour</span>
                  </div>
                </div>
                <ul className="plan-features">
                  <li>✓ Proficient Arabic (Native) Teacher</li>
                  <li>✓ E-Certificate</li>
                  <li>✓ E-Syllabus Access</li>
                  <li>✓ Direct Chat with Teacher and Coach</li>
                  <li>✓ Up to 4 Lesson Reschedules per Month*</li>
                  <li>✓ Coaching and Planning Sessions Twice a Year</li>
                  <li>✓ Progress Report Twice a Year</li>
                  <li>✓ Up to 1 Lesson Cancellation per Month**</li>
                  <li>✓ 5% Family Discounts***</li>
                  <li>✓ Top 5 Star Rated Teacher</li>
                  <li>✓ Video Recordings</li>
                </ul>
                <Link href="/trial-form" className="plan-button">
                  Book Free Trial
                </Link>
              </div>

              {/* Platinum Plan */}
              <div className="pricing-card platinum">
                <div className="plan-header">
                  <h3 className="plan-name">Platinum</h3>
                  <p className="plan-subtitle">Top-tier Access</p>
                  <div className="plan-price">
                    $14.00 <span>/hour</span>
                  </div>
                </div>
                <ul className="plan-features">
                  <li>✓ Proficient Arabic (Native) Teacher</li>
                  <li>✓ E-Certificate</li>
                  <li>✓ E-Syllabus Access</li>
                  <li>✓ Direct Chat with Teacher and Coach</li>
                  <li>✓ Unlimited Reschedules per Month*</li>
                  <li>✓ Coaching and Planning Sessions Every Quarter</li>
                  <li>✓ Progress Report Every Quarter</li>
                  <li>✓ Up to 3 Lesson Cancellations per Month**</li>
                  <li>✓ 10% Family Discounts***</li>
                  <li>✓ Top 5 Star Rated Teacher</li>
                  <li>✓ Video Recordings</li>
                </ul>
                <Link href="/trial-form" className="plan-button">
                  Book Free Trial
                </Link>
              </div>
            </div>

            {/* Notes Section */}
            <div className="pricing-notes">
              <p>* Rescheduled classes must be completed within 30 days of current month.</p>
              <p>** Any reschedules or cancellations must be informed to the teacher or admin at least 3-4 hours before the class start time; otherwise, the session is marked attended with no refund or reschedule.</p>
              <p>*** Discounts are offered to families with two or more members as per the applicable plan and are not valid for group classes. The family discount applies only to the second or subsequent student from the same family, not to all students.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="pricing-testimonials">
          <div className="pricing-container">
            <h2 className="testimonials-title">Stronger Faith. Stronger Together.</h2>
            <p className="testimonials-subtitle">
              Hear from our learners and parents building a stronger connection with Allah, together.
            </p>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "AlMaghrib Academy has helped my child develop a strong understanding of Islam in a fun and meaningful way. Highly recommended!"
                </p>
                <h4 className="testimonial-author">Ayesha Khan</h4>
                <p className="testimonial-role">Mother of 2</p>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "The lessons are clear, engaging and practical. I appreciate how easy it is to stay consistent with my learning."
                </p>
                <h4 className="testimonial-author">Hassan Ali</h4>
                <p className="testimonial-role">Adult Learner</p>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "We love how the whole family can learn together. AlMaghrib Academy has brought us closer to our faith and each other."
                </p>
                <h4 className="testimonial-author">Maryam Zahra</h4>
                <p className="testimonial-role">Parent</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTA />
      </main>

      <Footer />
    </>
  );
}