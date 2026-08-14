import "../pages-css/careers.css";
// import "../globals.css";
import Image from "next/image";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import WhyChooseUs from "../../src/components/sections/WhyChooseUs";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | AlMaghrib Academy",
  description:
    "Explore career opportunities at AlMaghrib Academy and join our mission to provide quality online Quran education.",
};

export default function CareersPage() {
  const values = [
    {
      title: "Ikhlas",
      desc: "We work sincerely seeking only the eternal pleasure of Allah in all circumstances.",
      icon: "/assets/images/ikhlas-1.png" // or .png, .jpg
    },
    {
      title: "Excellence",
      desc: "Delivering the highest standards of excellence in everything we undertake.",
      icon: "/assets/images/excellence-1.png"
    },
    {
      title: "Trust",
      desc: "Building lasting trust through honesty, integrity, and transparent daily actions.",
      icon: "/assets/images/trust-1.png"
    },
    {
      title: "Compassion",
      desc: "Treating every student and colleague with genuine kindness and respect.",
      icon: "/assets/images/compassion-1.png"
    },
    {
      title: "Growth",
      desc: "Continuous personal and professional growth through learning and excellence.",
      icon: "/assets/images/growth-1.png"
    },
    {
      title: "Collaboration",
      desc: "Together we achieve meaningful and lasting impact through united efforts.",
      icon: "/assets/images/collaboration-1.png"
    },
  ];

const benefits = [
  {
    number: "01",
    title: "Meaningful Islamic Impact",
    desc: "Help spread authentic Islamic knowledge and positively impact students worldwide.",
  },
  {
    number: "02",
    title: "Remote Flexibility",
    desc: "Work from anywhere while maintaining a healthy work-life balance.",
  },
  {
    number: "03",
    title: "Continuous Learning",
    desc: "Grow professionally and spiritually through ongoing training and development.",
  },
  {
    number: "04",
    title: "Global Team",
    desc: "Collaborate with educators, scholars, and professionals from around the world.",
  },
  {
    number: "05",
    title: "Supportive Culture",
    desc: "Join a team built on trust, respect, compassion, and shared Islamic values.",
  },
  {
    number: "06",
    title: "Career Growth",
    desc: "Take on new challenges, develop leadership skills, and advance your career.",
  },
];

  const perks = [
    {
      title: "Remote Work",
      className: "perk-blue",
    },
    {
      title: "Paid Leave",
      className: "perk-pink",
    },
    {
      title: "Professional Development",
      className: "perk-purple",
    },
    {
      title: "Flexible Schedule",
      className: "perk-green",
    },
    {
      title: "Islamic Learning Sessions",
      className: "perk-orange",
    },
    {
      title: "Team Retreats",
      className: "perk-cyan",
    },
  ];

  const jobs = [
    {
      title: "Quran Teacher – M/F",
      role: "Quran Study with Tajweed & Makharij",
      meta: "Permanent | 2 Years Exp. | Bilingual (English/Arabic)",
      description:
        "Quran Teacher with Ijazah and 2–3 years of online teaching experience for all age groups.",
    },
  ];

  return (
    <>
      <Header />
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Join Our Mission</h1>
          <p>
            Help us spread authentic Islamic knowledge worldwide and empower
            students through quality online education.
          </p>

          <a href="#jobs" className="career-btn">
            View Opportunities
          </a>
        </div>
      </section>

      {/* VALUES */}
      <section className="values">
        <div className="container">
          <h2>Our Values</h2>

          <div className="value-grid">
            {values.map((value, index) => (
              <div key={index} className="card">
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
                <div className="card-icon">
                <Image 
                    src={value.icon} 
                    alt={value.title}
                    width={200}
                    height={150}
                    priority={index < 3} // Load first 3 images faster
                  />
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <WhyChooseUs />

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <h2>What Our Team Says</h2>

          <div className="testimonial-grid">
            <div className="testimonial">
              <p>
                "Working at AlMaghrib Academy allows me to use my skills for a purpose
                that truly matters."
              </p>
              <h4>- Ahmed</h4>
            </div>

            <div className="testimonial">
              <p>
                "The team culture is supportive, inspiring, and focused on
                impact."
              </p>
              <h4>- Fatima</h4>
            </div>

            <div className="testimonial">
              <p>
                "I love the flexibility and the opportunity to serve the
                Ummah."
              </p>
              <h4>- Yusuf</h4>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="perks">
        <div className="container">
          <h2>Our Benefits</h2>

          <div className="perk-grid">
            {perks.map((perk, index) => (
              <div key={index} className={`perk ${perk.className}`}>
                {perk.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section className="open-positions" id="jobs">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Careers</span>
            <h2>Open Positions</h2>
            <p>
              Join AlMaghrib Academy and help shape the future of Islamic education.
            </p>
          </div>

          <div className="jobs-grid">
            {jobs.map((job, index) => (
              <div key={index} className="job-card">
                <h3>{job.title}</h3>

                <p className="job-title">
                  <strong>Job Title:</strong> {job.role}
                </p>

                <p className="job-meta">{job.meta}</p>

                <span className="job-type">Online</span>

                <p className="job-description">{job.description}</p>

                <a href="/teacher-application" className="apply-btn">
                  Apply Now →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
{/*      <section className="cta">
        <div className="container">
          <h2>Don't See Your Role?</h2>
          <p>Send us your CV and join our talent pool.</p>

          <a href="#" className="btn">
            Submit Resume
          </a>
        </div>
      </section>*/}
      <Footer />
    </>
  );
}