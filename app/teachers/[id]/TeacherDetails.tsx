"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../../../src/components/sections/Header";
import Footer from "../../../src/components/sections/Footer";
import { teachers } from "../../../src/data/teachers";
import "../../globals.css";




export default function TeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");
  const [showContactForm, setShowContactForm] = useState(false);

  const teacherId = parseInt(params.id as string);
  const teacher = teachers.find(t => t.id === teacherId);

  if (!teacher) {
    return (
      <>
        <Header />
        <div className="not-found">
          <h1>Teacher Not Found</h1>
          <p>Sorry, we couldn't find the teacher you're looking for.</p>
          <Link href="/teachers" className="back-btn">← Back to Teachers</Link>
        </div>
        <Footer />
        <style jsx>{`
          .not-found {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px;
          }
          .not-found h1 {
            color: #1a1a2e;
            font-size: 2.5rem;
            margin-bottom: 10px;
          }
          .not-found p {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 25px;
          }
          .back-btn {
            padding: 12px 30px;
            background: #1a1a2e;
            color: #fff;
            border-radius: 8px;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          .back-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(26, 26, 46, 0.3);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="profile-page">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="container">
            <Link href="/teachers" className="back-link">
              ← Back to All Teachers
            </Link>
            <div className="profile-header-content">
              <div className="profile-avatar">
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  width={150}
                  height={150}
                  className="profile-image"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/images/default-teacher.png";
                  }}
                />
              </div>
              <div className="profile-info">
                <h1>{teacher.name}</h1>
                <p className="profile-role">{teacher.role}</p>
                <div className="profile-meta">
                  <span className="meta-item">⭐ {teacher.rating}</span>
                  <span className="meta-item">👨‍🎓 {teacher.students} Students</span>
                  <span className="meta-item">📚 {teacher.experience}</span>
                </div>
                <div className="profile-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => router.push('/trial-form')}
                  >
                    Book Trial Class
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    Contact Teacher
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="modal-overlay" onClick={() => setShowContactForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowContactForm(false)}>✕</button>
              <h2>Contact {teacher.name}</h2>
              <form className="contact-form">
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea rows={4} placeholder="Your Message" required></textarea>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <section className="profile-content">
          <div className="container">
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
              <button 
                className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                Courses
              </button>
              <button 
                className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
                onClick={() => setActiveTab('availability')}
              >
                Availability
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'about' && (
                <div className="about-section">
                  <div className="about-grid">
                    <div className="about-main">
                      <h2>About {teacher.name}</h2>
                      <p>{teacher.bio}</p>
                      <div className="about-details">
                        <div className="detail-item">
                          <strong>🎓 Education:</strong>
                          <p>{teacher.education}</p>
                        </div>
                        <div className="detail-item">
                          <strong>🎯 Specialty:</strong>
                          <p>{teacher.specialty}</p>
                        </div>
                        <div className="detail-item">
                          <strong>🗣️ Languages:</strong>
                          <p>{teacher.languages.join(", ")}</p>
                        </div>
                        <div className="detail-item">
                          <strong>📖 Teaching Style:</strong>
                          <p>{teacher.teachingStyle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="about-sidebar">
                      <div className="sidebar-card">
                        <h3>Quick Info</h3>
                        <div className="info-item">
                          <span>Experience</span>
                          <strong>{teacher.experience}</strong>
                        </div>
                        <div className="info-item">
                          <span>Students</span>
                          <strong>{teacher.students}+</strong>
                        </div>
                        <div className="info-item">
                          <span>Rating</span>
                          <strong>⭐ {teacher.rating}</strong>
                        </div>
                        <button className="btn-primary full-width" onClick={() => router.push('/trial-form')}>
                          Book Trial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="courses-section">
                  <h2>Courses Offered</h2>
                  <div className="courses-grid">
                    {teacher.courses.map((course, index) => (
                      <div key={index} className="course-card">
                        <h3>{course}</h3>
                        <p>Taught by {teacher.name}</p>
                        <button className="btn-secondary small">
                          Learn More
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <div className="availability-section">
                  <h2>Teaching Availability</h2>
                  <div className="availability-card">
                    <div className="availability-info">
                      <span>⏰ General Hours</span>
                      <strong>{teacher.availability}</strong>
                    </div>
                    <div className="availability-info">
                      <span>🌍 Time Zone</span>
                      <strong>GMT (Flexible)</strong>
                    </div>
                    <div className="availability-info">
                      <span>📅 Days Available</span>
                      <strong>Monday - Saturday</strong>
                    </div>
                    <p className="availability-note">
                      * Specific times can be arranged based on student preference
                    </p>
                    <button className="btn-primary" onClick={() => router.push('/trial-form')}>
                      Book a Time Slot
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Teachers */}
        <section className="related-teachers">
          <div className="container">
            <h2>Related Teachers</h2>
            <div className="related-grid">
              {teachers
                .filter(t => t.id !== teacher.id)
                .slice(0, 3)
                .map((related) => (
                  <Link href={`/teachers/${related.id}`} key={related.id} className="related-card">
                    <Image
                      src={related.image}
                      alt={related.name}
                      width={60}
                      height={60}
                      className="related-image"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/default-teacher.png";
                      }}
                    />
                    <div className="related-info">
                      <h4>{related.name}</h4>
                      <p>{related.role}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .back-link {
          display: inline-block;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-weight: 500;
          padding: 10px 0 20px 0;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: #fff;
        }

        .profile-header {
          background: linear-gradient(135deg, #0a2e7a 0%, #1a4a9a 100%);
          padding: 40px 0 50px 0;
          color: #fff;
          padding-top:150px;
        }

        .profile-header-content {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .profile-avatar {
          flex-shrink: 0;
        }

        .profile-image {
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.3);
          width: 150px;
          height: 150px;
          object-fit: cover;
        }

        .profile-info h1 {
          font-size: 2.5rem;
          margin: 0 0 5px 0;
        }

        .profile-role {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0 0 15px 0;
        }

        .profile-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .meta-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .profile-actions {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 12px 30px;
          background: #fff;
          color: #0a2e7a;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(255, 255, 255, 0.2);
        }

        .btn-secondary {
          padding: 12px 30px;
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
        }

        .btn-secondary.small {
          padding: 8px 20px;
          font-size: 0.9rem;
        }

        .btn-primary.full-width {
          width: 100%;
          margin-top: 10px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          padding: 40px;
          border-radius: 15px;
          max-width: 500px;
          width: 90%;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
        }

        .modal-close:hover {
          color: #333;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: #0a2e7a;
        }

        /* Tabs */
        .profile-tabs {
          display: flex;
          gap: 10px;
          border-bottom: 2px solid #e9ecef;
          margin-bottom: 30px;
        }

        .tab-btn {
          padding: 12px 25px;
          background: none;
          border: none;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          transition: color 0.3s ease;
        }

        .tab-btn:hover {
          color: #0a2e7a;
        }

        .tab-btn.active {
          color: #0a2e7a;
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #0a2e7a;
        }

        /* About Section */
        .about-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .about-main h2 {
          color: #0a2e7a;
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .about-main p {
          color: #555;
          line-height: 1.8;
          margin-bottom: 25px;
        }

        .about-details {
          display: grid;
          gap: 15px;
        }

        .detail-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }

        .detail-item strong {
          display: block;
          color: #0a2e7a;
          margin-bottom: 5px;
        }

        .detail-item p {
          margin: 0;
          color: #555;
        }

        .about-sidebar {
          position: sticky;
          top: 20px;
          align-self: start;
        }

        .sidebar-card {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 12px;
        }

        .sidebar-card h3 {
          color: #0a2e7a;
          margin: 0 0 20px 0;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-item span {
          color: #666;
        }

        .info-item strong {
          color: #0a2e7a;
        }

        /* Courses */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .course-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .course-card h3 {
          color: #0a2e7a;
          margin: 0 0 10px 0;
        }

        .course-card p {
          color: #666;
          margin: 0 0 15px 0;
        }

        /* Availability */
        .availability-card {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 12px;
          max-width: 500px;
        }

        .availability-info {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .availability-info:last-of-type {
          border-bottom: none;
        }

        .availability-info span {
          color: #666;
        }

        .availability-info strong {
          color: #0a2e7a;
        }

        .availability-note {
          color: #888;
          font-size: 0.9rem;
          margin: 15px 0;
        }

        /* Related Teachers */
        .related-teachers {
          background: #f8f9fa;
          padding: 40px 0;
        }

        .related-teachers h2 {
          text-align: center;
          color: #0a2e7a;
          margin-bottom: 30px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .related-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #fff;
          padding: 15px;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }

        .related-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .related-image {
          border-radius: 50%;
          width: 60px;
          height: 60px;
          object-fit: cover;
        }

        .related-info h4 {
          margin: 0 0 3px 0;
          color: #0a2e7a;
        }

        .related-info p {
          margin: 0;
          color: #666;
          font-size: 0.85rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-header-content {
            flex-direction: column;
            text-align: center;
          }

          .profile-meta {
            justify-content: center;
          }

          .profile-actions {
            justify-content: center;
          }

          .about-grid {
            grid-template-columns: 1fr;
          }

          .about-sidebar {
            position: static;
          }

          .profile-tabs {
            justify-content: center;
            flex-wrap: wrap;
          }

          .tab-btn {
            padding: 10px 15px;
            font-size: 0.9rem;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .related-grid {
            grid-template-columns: 1fr 1fr;
          }

          .profile-info h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .related-grid {
            grid-template-columns: 1fr;
          }

          .profile-header {
            padding: 20px 0 30px 0;
          }

          .profile-image {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </>
  );
}