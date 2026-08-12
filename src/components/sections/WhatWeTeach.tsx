import "../sections-css/WhatWeTeach.css";
import Link from "next/link";
const courses = [
  {
    badge: "QURAN",
    title: "Qur'an Course",
    description:
      "Learn Quran reading online with expert teachers. Perfect for beginners, children, and adults seeking accurate recitation, confidence, and lifelong Quran learning skills.",
    color: "what-we-teach-card4",
    icon: "☪",
  },

  {
    badge: "ARABIC",
    title: "Arabic Language",
    description:
      "Learn Arabic online with experienced teachers. Perfect for beginners, children, and adults developing speaking, reading, writing, and Quranic Arabic communication skills.",
    color: "what-we-teach-card3",
    icon: "ض",
  },
  {
    badge: "ISLAMIC",
    title: "Islamic Studies",
    description:
      "Gain authentic Islamic knowledge through expert teachers. Perfect for beginners, children, and adults learning Aqeedah, Fiqh, Hadith, Seerah, Islamic manners, daily duas and essential knowledge.",
    color: "what-we-teach-card5",
    icon: "☾",
  },

];

export default function WhatWeTeach() {
  return (
    <section className="what-we-teach-courses-section">
      <div className="what-we-teach-courses-container">
        {/*<span className="what-we-teach-courses-subtitle">
          Our Programs
        </span>*/}

        <h2 className="what-we-teach-courses-title">
          Online Quran Classes <br /> Arabic Courses & <br /> Islamic Studies <br /> Courses for Kids and Adults
        </h2>

        <p className="what-we-teach-courses-description">
          Explore our comprehensive online learning programs designed to help
          students learn Quran online, improve Tajweed, memorize the Quran,
          study Arabic, and gain authentic Islamic knowledge from qualified
          teachers worldwide.
        </p>

        <div className="what-we-teach-cards">
          {courses.map((course) => (
            <div
              key={course.title}
              className={`what-we-teach-card ${course.color}`}
            >
              <div className="what-we-teach-circle"></div>

              <span className="what-we-teach-badge">
                {course.badge}
              </span>

              <div className="what-we-teach-content">
                <h2>{course.title}</h2>

                <p className="what-we-teach-black-text">{course.description}</p>

                {/*<a href="/courses">
                  Learn More →
                </a>*/}

                <Link href="/courses" className="what-we-teach-learn-more-link">
                  Learn More
                </Link>
              </div>

              <div className="what-we-teach-icon">
                {course.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}