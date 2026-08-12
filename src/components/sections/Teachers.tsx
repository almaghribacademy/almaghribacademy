"use client";

import "../sections-css/Teachers.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const teachers = [
  {
    name: "Qualified Quran Teachers",
    experience: "10+ Years Experience",
    description:
      "Learn Quran online with experienced teachers providing personalized lessons, proper Tajweed guidance, accurate pronunciation, and continuous learning support daily.",
    image: "teacher-female-1.png",
    fallbackImage: "/assets/images/teacher-fallback-female.jpg",
  },
  {
    name: "Certified Tajweed Specialists",
    experience: "10+ Years Experience",
    description:
      "Master Quran recitation through certified Tajweed specialists offering expert guidance, clear pronunciation, practical exercises, and consistent improvement every lesson.",
    image: "teacher-female-2.png",
    fallbackImage: "/assets/images/teacher-fallback-female.jpg",
  },
  {
    name: "Professional Arabic Instructors",
    experience: "10+ Years Experience",
    description:
      "Learn Arabic confidently with professional instructors teaching grammar, vocabulary, conversation, Quranic Arabic, reading, writing, and listening skills effectively.",
    image: "teacher-male-1.png",
    fallbackImage: "/assets/images/teacher-fallback-male.jpg",
  },
  {
    name: "Islamic Studies Teachers",
    experience: "10+ Years Experience",
    description:
      "Gain authentic Islamic knowledge through dedicated teachers covering Aqeedah, Fiqh, Hadith, Seerah, Islamic manners, and daily practical guidance confidently.",
    image: "teacher-male-2.png",
    fallbackImage: "/assets/images/teacher-fallback-male.jpg",
  },
];
export default function Teachers() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section className="teachers-section-section">
      <div className="teachers-section-container">
        <span className="teachers-section-subtitle">
          Our Qualified Instructors
        </span>

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
          {teachers.map((teacher, index) => (
            <div key={teacher.name} className="teacher-section-card">
              <div className="teacher-section-avatar">
                {!imageErrors[index] ? (
                  <Image
                    src={`/assets/images/${teacher.image}`}
                    alt={teacher.name}
                    width={112}
                    height={112}
                    className="teacher-section-image"
                    onError={() => handleImageError(index)}
                    priority={index < 2}
                  />
                ) : (
                  <div className="teacher-section-initials">
                    {teacher.name.charAt(0)}
                  </div>
                )}
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