import "../sections-css/HowToStart.css";
import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Browse Our Courses",
    description: "Explore & Choose from Our Interactive Courses Today!",
    image: "/assets/images/browse-our-courses.png", // Replace with your image path
    alt: "Browse Courses",
  },
  {
    number: "02",
    title: "Enroll Instantly with Confidence",
    description: "Simple, secure, and stress-free – your learning begins now!",
    image: "/assets/images/enroll-form.png", // Replace with your image path
    alt: "Enroll Now",
  },
  {
    number: "03",
    title: "Start Learning Right Away!",
    description: "You're all set! Enjoy seamless access to your course anytime, anywhere.",
    image: "/assets/images/start-learning.png", // Replace with your image path
    alt: "Start Learning",
  },
];

export default function HowToStart() {
  return (
    <section className="steps-section">
      <div className="steps-container">
        <span className="steps-subtitle">
          Getting Started Is Easy
        </span>

        <h2 className="steps-title">
          Begin Your Online <br /> Learning Journey in 3 Easy Steps
        </h2>

        <p className="steps-description">
          Joining AlMaghrib Academy is simple. From your free trial class to
          personalized one-to-one learning, we make it easy for students of
          all ages to learn Quran online with confidence.
        </p>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="step-card"
            >
              {/* Circular Image */}
              <div className="step-image-wrapper">
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={50}
                  height={50}
                  className="step-image"
                />
                <div className="step-number-circle">
                  {step.number}
                </div>
              </div>

              <h3 className="step-heading">
                {step.title}
              </h3>

              <p className="step-text">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}