"use client";

import "../sections-css/Teachers.css";
import Link from "next/link";
import Image from "next/image";

const teachers = [
  {
    name: "Qualified Quran Teachers",
    experience: "10+ Years Experience",
    description:
      "Learn Quran online with experienced Quran teachers who provide personalized lessons, proper pronunciation guidance, and step-by-step Quran learning support.",
    image: "teacher-female-1.png",
  },
  {
    name: "Certified Tajweed Specialists",
    experience: "10+ Years Experience",
    description:
      "Our Tajweed experts help students master Quran recitation rules, improve their voice clarity, and learn correct Quran pronunciation.",
    image: "teacher-female-2.png",
  },
  {
    name: "Professional Arabic Instructors",
    experience: "10+ Years Experience",
    description:
      "Expert Arabic teachers help students understand Arabic language basics, Quranic vocabulary, and communication skills through structured courses.",
    image: "teacher-male-1.png",
  },
  {
    name: "Islamic Studies Teachers",
    experience: "10+ Years Experience",
    description:
      "Our Islamic studies teachers guide students with authentic Islamic knowledge, values, manners, and essential teachings of Islam.",
    image: "teacher-male-2.png",
  },
];

export default function Teachers() {
  return (
    <section className="teachers-section-section">
      <div className="teachers-section-container">
        <h2 className="teachers-section-title">
          Meet Our Experienced <br /> Quran & Islamic Studies Teachers
        </h2>

        <p className="teachers-section-description">
          Our qualified online Quran teachers and Islamic scholars are dedicated
          to helping children and adults learn Quran, Tajweed, Arabic, and
          Islamic studies through interactive one-to-one online classes.
          Students from around the world can learn from trusted instructors
          with flexible schedules and personalized guidance.
        </p>

        <div className="teachers-section-grid">
          {teachers.map((teacher) => (
            <div key={teacher.name} className="teacher-section-card">
              <div className="teacher-section-avatar">
                <Image
                  src={`/assets/images/${teacher.image}`}
                  alt={teacher.name}
                  width={112}
                  height={112}
                  className="teacher-section-image"
                />
              </div>

              <h3 className="teacher-section-name">{teacher.name}</h3>
              <p className="teacher-section-experience">{teacher.experience}</p>
              <p className="teacher-section-text">{teacher.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}