"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import TeachersBanner from "../../src/components/sections/TeachersBanner";
import { teachers } from "../../src/data/teachers";
import "../globals.css";
import "../pages-css/teacher.css";



export default function TeachersPage() {
  return (
    <>
      <Header />

      <main className="teachers-page-page">
        {/* Hero Section */}
        <section className="teachers-page-hero">
          <div className="teachers-page-container">
            <h1 className="teachers-page-hero-title">Meet Our Teachers</h1>
            <p className="teachers-page-hero-text">
              Learn from qualified, experienced and dedicated Quran,
              Arabic and Islamic Studies teachers.
            </p>
            <Link href="/register">
              <button className="teacher-cta-button">Book Free Trial</button>
            </Link>
          </div>
        </section>

        {/* Teachers Grid */}
        <section className="teachers-page-section">
          <div className="teachers-page-container">
            <div className="teachers-page-grid">
              {teachers.map((teacher) => (
                <Link 
                  href={`/teachers/${teacher.id}`} 
                  key={teacher.id}
                  className="teacher-page-card-link"
                >
                  <div className="teacher-page-card">
                    <div className="teacher-page-avatar">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        width={120}
                        height={120}
                        className="teacher-image"
                        priority={false}
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.src = "/assets/images/default-teacher.png";
                        }}
                      />
                    </div>
                    <h3 className="teacher-page-name">{teacher.name}</h3>
                    <p className="teacher-page-role">{teacher.role}</p>
                    <span className="teacher-page-experience">
                      {teacher.experience}
                    </span>
                    <div className="teacher-rating">
                      <span className="stars">⭐ {teacher.rating}</span>
                      <span className="students">👨‍🎓 {teacher.students}</span>
                    </div>
                    <button className="teacher-page-button">View Profile →</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <TeachersBanner />

        <section className="teachers-page-benefits">
          <div className="teachers-page-container">
            <h2 className="benefits-title">Why Learn With Our Teachers?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <h3>Qualified Scholars</h3>
                <p>Certified teachers with strong Islamic education backgrounds.</p>
              </div>
              <div className="benefit-card">
                <h3>One-to-One Classes</h3>
                <p>Personalized learning plans for every student.</p>
              </div>
              <div className="benefit-card">
                <h3>Flexible Timings</h3>
                <p>Learn according to your schedule from anywhere.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/*<style jsx>{`
        .teacher-page-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .teacher-page-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 15px auto;
          border: 4px solid #f0f4ff;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .teacher-page-card:hover .teacher-page-avatar {
          border-color: #1a1a2e;
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(26, 26, 46, 0.15);
        }

        .teacher-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .teacher-rating {
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 0.9rem;
          color: #666;
          margin: 10px 0;
        }

        .stars {
          color: #f6c23e;
        }

        .students {
          color: #4e73df;
        }

        .teachers-page-hero {
          background: linear-gradient(135deg, #0a2e7a 0%, #1a4a9a 100%);
          padding: 80px 20px 60px;
          text-align: center;
          color: #fff;
        }

        .teachers-page-hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .teachers-page-hero-text {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 30px;
          opacity: 0.9;
        }

        .cta-button {
          padding: 14px 36px;
          background: #fff;
          color: #0a2e7a;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .teachers-page-section {
          padding: 60px 20px;
          background: #f8fafc;
        }

        .teachers-page-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .teachers-page-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .teacher-page-card {
          background: #fff;
          padding: 30px 20px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid rgba(10, 46, 122, 0.06);
        }

        .teacher-page-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(10, 46, 122, 0.12);
          border-color: rgba(10, 46, 122, 0.12);
        }

        .teacher-page-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0a2e7a;
          margin: 0 0 6px 0;
        }

        .teacher-page-role {
          font-size: 0.95rem;
          color: #666;
          margin: 0 0 6px 0;
        }

        .teacher-page-experience {
          display: inline-block;
          background: #e8f0fe;
          color: #0a2e7a;
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .teacher-page-button {
          width: 100%;
          padding: 10px;
          background: #0a2e7a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .teacher-page-button:hover {
          background: #1a4a9a;
        }

        .teachers-page-benefits {
          padding: 60px 20px;
          background: #fff;
        }

        .benefits-title {
          text-align: center;
          font-size: 2.2rem;
          font-weight: 700;
          color: #0a2e7a;
          margin-bottom: 40px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .benefit-card {
          text-align: center;
          padding: 30px 20px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .benefit-card h3 {
          color: #0a2e7a;
          margin-bottom: 10px;
        }

        .benefit-card p {
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .teachers-page-hero-title {
            font-size: 2rem;
          }

          .teachers-page-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .teachers-page-grid {
            grid-template-columns: 1fr;
          }

          .teachers-page-hero-title {
            font-size: 1.8rem;
          }
        }
      `}</style>*/}
    </>
  );
}