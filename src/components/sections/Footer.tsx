"use client";
import "../sections-css/Footer.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address.",
        confirmButtonColor: "#0a2e7a",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#0a2e7a",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Subscribed Successfully! 🎉",
          text: "Thank you for subscribing to our newsletter.",
          confirmButtonColor: "#0a2e7a",
        });
        setEmail("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to subscribe. Please try again.",
          confirmButtonColor: "#0a2e7a",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#0a2e7a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="newsletter-section">
        <div className="blog-container">
          <h2>Subscribe To Our Newsletter</h2>
          <p>Receive the latest Islamic articles and learning resources.</p>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-column">
              <h3 className="footer-brand">
                <Link href="/">
                  <Image
                    src={"/assets/images/AlMaghrib-white-logo.png"}
                    alt="AlMaghrib Academy"
                    width={300}
                    height={250}
                    priority
                  />
                </Link>
              </h3>

              <p className="footer-description">
                AlMaghrib Academy is a trusted online Quran academy providing
                Quran reading, Tajweed, Hifz, Arabic language, and Islamic
                studies classes for children and adults worldwide. Learn Quran
                online with qualified Quran teachers through personalized
                one-to-one lessons and flexible schedules.
                Learn Quran online with experienced Quran teachers through
                interactive one-to-one classes. Our online Quran academy helps
                students worldwide master Quran reading, Tajweed, Hifz,
                Arabic language, and Islamic studies with flexible schedules
                and personalized learning plans.
              </p>
              <div className="footer-social">
                <h4 className="footer-heading">Follow Us</h4>
                <div className="social-icons">
                  <Link
                    href="https://www.facebook.com/people/LearnwithAlMaghribacademy/61592019329310/"
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <FaFacebookF />
                  </Link>

                  <Link
                    href="https://www.instagram.com/learnwithAlMaghribacademy/"
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </Link>

                  <Link
                    href="https://www.youtube.com/channel/UC9Q8M4_u1gYayoE_JYj6Y9A"
                    target="_blank"
                    aria-label="YouTube"
                  >
                    <FaYoutube />
                  </Link>

                  <Link
                    href="https://wa.me/+447700181874"
                    target="_blank"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp />
                  </Link>

                  <Link href="https://linkedin.com/company/your-company" target="_blank">
                    <FaLinkedinIn />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quran Academy Links</h4>
              <ul className="footer-links">
                <li><Link href="/" className="nav-link">Home</Link></li>
                <li><Link href="/about" className="nav-link">About Us</Link></li>
                <li><Link href="/courses" className="nav-link">Our Online Courses</Link></li>
                <li><Link href="/teachers" className="nav-link">Our Teachers</Link></li>
                <li><Link href="/testimonials" className="nav-link">Student Reviews</Link></li>
                <li><Link href="/contact" className="nav-link">Contact Us</Link></li>
              </ul>
            </div>

            {/* Courses */}
            <div className="footer-column">
              <h4 className="footer-heading">Popular Quran Courses</h4>
              <ul className="footer-links">
                <li><Link href="/courses/quran-learning-with-tajweed" className="nav-link">Quran Learning with Tajweed</Link></li>
                <li><Link href="/courses/arabic-language-mastery" className="nav-link">Arabic Language Mastery</Link></li>
                <li><Link href="/courses/islamic-studies-character" className="nav-link">Islamic Studies & Character Building</Link></li>
                <li><Link href="/courses/quran-hifz-memorization" className="nav-link">Quran Hifz Memorization Program</Link></li>
                <li><Link href="/courses/noorani-qaida-beginners" className="nav-link">Noorani Qaida for Beginners</Link></li>
                <li><Link href="/courses/tafseer-quran-understanding" className="nav-link">Tafseer & Quran Understanding</Link></li>
                <li><Link href="/courses" className="nav-link">Our Courses for Kids & Adults</Link></li>
              </ul>
            </div>

            {/* Explore */}
            <div className="footer-column">
              <h4 className="footer-heading">Explore</h4>
              <ul className="footer-links">
                <li><Link href="/pricing" className="nav-link">Pricing</Link></li>
                <li><Link href="/about" className="nav-link">About Us</Link></li>
                <li><Link href="/blog" className="nav-link">Blog</Link></li>
                <li><Link href="/teachers" className="nav-link">Teachers</Link></li>
                <li><Link href="/testimonials" className="nav-link">Testimonials</Link></li>
                <li><Link href="/faq" className="nav-link">FAQ</Link></li>
                <li><Link href="/courses" className="nav-link">Courses</Link></li>
                <li><Link href="/careers" className="nav-link">Careers</Link></li>
                <li><Link href="/contact" className="nav-link">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <Link href="/terms-and-conditions" className="nav-link">
                Terms & Conditions
              </Link>
            </div>
            <div className="footer-bottom-center">
              © {new Date().getFullYear()} AlMaghrib Academy. All Rights Reserved.
            </div>
            <div className="footer-bottom-right">
              <Link href="/privacy-policy" className="nav-link">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}