import Link from "next/link";
import Image from "next/image";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import CTA from "../../src/components/sections/CTA";
import "../pages-css/testimonials.css";


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Testimonials | AlMaghrib Academy",
  description:
    "Read reviews and success stories from students and parents learning Quran online with AlMaghrib Academy.",
};

const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    role: "Mother of 2",
    location: "London, UK",
    rating: 5,
    text: "AlMaghrib Academy has helped my child develop a strong understanding of Islam in a fun and meaningful way. The teachers are patient, knowledgeable, and truly care about their students' progress. My children look forward to their Quran classes every week!",
    image: "/assets/images/testimonial-1.jpg",
    course: "Quran Reading for Kids"
  },
  {
    id: 2,
    name: "Hassan Ali",
    role: "Adult Learner",
    location: "Birmingham, UK",
    rating: 5,
    text: "The lessons are clear, engaging and practical. I appreciate how easy it is to stay consistent with my learning. The one-to-one sessions with my teacher have helped me improve my Tajweed significantly. Highly recommended for anyone serious about learning Quran.",
    image: "/assets/images/testimonial-2.jpg",
    course: "Tajweed & Recitation"
  },
  {
    id: 3,
    name: "Maryam Zahra",
    role: "Parent",
    location: "Manchester, UK",
    rating: 5,
    text: "We love how the whole family can learn together. AlMaghrib Academy has brought us closer to our faith and each other. The flexible scheduling and qualified teachers make it easy for everyone to participate.",
    image: "/assets/images/testimonial-3.jpg",
    course: "Islamic Studies"
  },
  {
    id: 4,
    name: "Omar Farooq",
    role: "University Student",
    location: "Leeds, UK",
    rating: 5,
    text: "I've tried several online Quran academies, but AlMaghrib Academy stands out. The teachers are highly qualified, the curriculum is well-structured, and the support is amazing. My Arabic has improved dramatically in just a few months.",
    image: "/assets/images/testimonial-4.jpg",
    course: "Arabic Language Mastery"
  },
  {
    id: 5,
    name: "Sarah Ahmed",
    role: "Working Professional",
    location: "Dubai, UAE",
    rating: 5,
    text: "As a busy professional, I needed flexible Quran classes that fit my schedule. AlMaghrib Academy provided exactly that! My teacher is understanding and adapts to my pace. I'm finally making progress with my Hifz.",
    image: "/assets/images/testimonial-5.jpg",
    course: "Quran Hifz Program"
  },
  {
    id: 6,
    name: "Abdullah Malik",
    role: "Father of 3",
    location: "Toronto, Canada",
    rating: 5,
    text: "Finding a reliable online Quran academy for my children was challenging until I found AlMaghrib Academy. The teachers are amazing with kids, making learning fun and interactive. My children's Islamic knowledge has grown tremendously.",
    image: "/assets/images/testimonial-6.jpg",
    course: "Quran & Islamic Studies"
  },
  {
    id: 7,
    name: "Fatima Noor",
    role: "Sister",
    location: "New York, USA",
    rating: 5,
    text: "I'm so grateful to have found female Quran teachers at AlMaghrib Academy. The learning environment is comfortable and supportive. My recitation has improved so much, and I feel more connected to the Quran than ever before.",
    image: "/assets/images/testimonial-7.jpg",
    course: "Quran Recitation"
  },
  {
    id: 8,
    name: "Yusuf Ibrahim",
    role: "New Muslim",
    location: "Sydney, Australia",
    rating: 5,
    text: "As a new Muslim, I needed guidance in learning Quran and Islamic basics. AlMaghrib Academy has been incredibly welcoming and supportive. The teachers explain everything clearly and patiently. I couldn't have asked for a better learning experience.",
    image: "/assets/images/testimonial-8.jpg",
    course: "Islamic Studies for Beginners"
  },
  {
    id: 9,
    name: "Zainab Hasan",
    role: "Mother",
    location: "California, USA",
    rating: 5,
    text: "The progress reports and regular feedback from AlMaghrib Academy teachers are excellent. I can see my daughter's improvement every month. The structured approach and qualified teachers make a real difference.",
    image: "/assets/images/testimonial-9.jpg",
    course: "Quran Reading for Kids"
  },
  {
    id: 10,
    name: "Mohammed Raza",
    role: "Engineer",
    location: "Karachi, Pakistan",
    rating: 5,
    text: "I was looking for a comprehensive Arabic course to understand the Quran better. AlMaghrib Academy delivered beyond my expectations. The teachers explain Arabic grammar in a way that's easy to understand and remember.",
    image: "/assets/images/testimonial-10.jpg",
    course: "Arabic Language Course"
  },
  {
    id: 11,
    name: "Amina Hussain",
    role: "Medical Student",
    location: "Chicago, USA",
    rating: 5,
    text: "Balancing medical studies and Quran learning seemed impossible, but AlMaghrib Academy made it work. The flexible scheduling and dedicated teachers allow me to pursue both with excellence. Truly a blessing!",
    image: "/assets/images/testimonial-11.jpg",
    course: "Tajweed & Recitation"
  },
  {
    id: 12,
    name: "Ibrahim Ahmed",
    role: "Grandfather",
    location: "Cairo, Egypt",
    rating: 5,
    text: "I wanted to learn Quran properly after many years of reciting with mistakes. AlMaghrib Academy's teachers have been so patient and respectful. At 65, I'm finally learning Tajweed correctly. It's never too late to learn!",
    image: "/assets/images/testimonial-12.jpg",
    course: "Quran Learning with Tajweed"
  }
];

export default function TestimonialsPage() {
  // Get featured testimonials (first 3)
  const featuredTestimonials = testimonials.slice(0, 3);
  const remainingTestimonials = testimonials.slice(3);

  return (
    <>
      <Header />

      <main className="testimonials-page">
        {/* Hero Section */}
        <section className="testimonials-hero">
          <div className="testimonials-container">
            <span className="testimonials-badge">Testimonials</span>
            <h1 className="testimonials-hero-title">
              What Our Students Say
            </h1>
            <p className="testimonials-hero-text">
              Hear from our learners and parents who have built a stronger 
              connection with Allah through AlMaghrib Academy.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="testimonials-stats">
          <div className="testimonials-container">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>4.9/5</h3>
                <p>Average Rating</p>
              </div>
              <div className="stat-card">
                <h3>5,000+</h3>
                <p>Students Worldwide</p>
              </div>
              <div className="stat-card">
                <h3>98%</h3>
                <p>Satisfaction Rate</p>
              </div>
              <div className="stat-card">
                <h3>20+</h3>
                <p>Qualified Teachers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Testimonials */}
        <section className="featured-testimonials">
          <div className="testimonials-container">
            <h2 className="featured-title">Featured Testimonials</h2>
            <div className="featured-grid">
              {featuredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="featured-card">
                  <div className="featured-header">
                    <div className="featured-avatar">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="avatar-image"
                      />
                    </div>
                    <div className="featured-info">
                      <h3>{testimonial.name}</h3>
                      <p>{testimonial.role} • {testimonial.location}</p>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="star">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="featured-quote">❝</div>
                  <p className="featured-text">{testimonial.text}</p>
                  <p className="featured-course">Course: {testimonial.course}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Testimonials Grid */}
        <section className="all-testimonials">
          <div className="testimonials-container">
            <h2 className="section-title">More Stories</h2>
            <div className="testimonials-grid">
              {remainingTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="avatar-image"
                      />
                    </div>
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                      <div className="rating small">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="star">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-quote">❝</div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <p className="testimonial-course">Course: {testimonial.course}</p>
                </div>
              ))}
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