import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../src/components/sections/Header";
import Footer from "../../../src/components/sections/Footer";
import Teachers from "../../../src/components/sections/Teachers";
import CTA from "../../../src/components/sections/CTA";
import { courses } from "../page";
import "../../pages-css/course-details.css";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const course = getCourse(slug);

  if (!course) {
    return {
      title: "Course Not Found | AlMaghrib Academy",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} | AlMaghrib Academy`,
    description: course.description,

    openGraph: {
      title: `${course.title} | AlMaghrib Academy`,
      description: course.description,
      url: `https://AlMaghribacademy.co/courses/${course.slug}`,
      siteName: "AlMaghrib Academy",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${course.title} | AlMaghrib Academy`,
      description: course.description,
    },
  };
}

// Find course by slug
function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

// Generate static paths for all courses
export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  // ✅ Await the params Promise
  const { slug } = await params;
  const course = getCourse(slug);

  // If course not found, show 404
  if (!course) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="course-page">
        {/* Hero Section */}
        <section className="course-hero">
          <div className="course-container">
            <span className="course-badge">{course.badge}</span>
            <h1 className="course-detail-title">{course.title}</h1>
            <p className="course-details-description">{course.fullDescription}</p>
            <Link href="/trial-form">
              <button className="course-btn">Book Free Trial</button>
            </Link>
          </div>
        </section>

        {/* Course Overview Section */}
        <section className="overview-section">
          <div className="course-container">
            <div className="overview-grid">
              <div>
                <h2>Course Overview</h2>
                <p>{course.fullDescription}</p>
                <p>
                  This {course.level} course is designed to help students 
                  master {course.title} through structured lessons, 
                  personalized guidance, and regular assessments.
                </p>
              </div>

              <div className="overview-card">
                <h3>Course Information</h3>
                <ul>
                  <li><span>Duration:</span> {course.duration}</li>
                  <li><span>Level:</span> {course.level}</li>
                  <li><span>Classes:</span> {course.classes}</li>
                  <li><span>Mode:</span> {course.mode}</li>
                  <li><span>Certificate:</span> {course.certificate}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Outcomes Section */}
        <section className="learning-section">
          <div className="course-container">
            <h2 className="section-title">What You'll Learn</h2>
            <div className="learning-grid">
              {course.learningOutcomes.map((outcome, index) => (
                <div key={index} className="learning-card">
                  <span className="learning-icon">✓</span>
                  {outcome}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="curriculum-section">
          <div className="course-container">
            <h2 className="section-title">Course Curriculum</h2>
            <div className="curriculum-list">
              {course.modules.map((module, index) => (
                <div key={index} className="curriculum-item">
                  <span className="module-number">{String(index + 1).padStart(2, '0')}</span>
                  {module}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Teachers Section */}
        <Teachers />

        {/* CTA Section */}
        <CTA />
      </main>

      <Footer />
    </>
  );
}