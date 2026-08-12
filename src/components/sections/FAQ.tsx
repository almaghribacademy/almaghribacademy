"use client";
import Image from "next/image";
import { useState } from "react";
import "../sections-css/FAQ.css";
const faqs = [
  {
    question: "What online Quran courses do you offer?",
    answer:
      "We offer comprehensive online Quran courses including Quran Reading, Quran Recitation with Tajweed, Hifz (Quran Memorization), Arabic Language, and Islamic Studies programs for children and adults. Our courses are designed to help students learn Quran correctly with experienced teachers."
  },
  {
    question: "Are your Quran classes completely online?",
    answer:
      "Yes, our online Quran classes allow students from around the world to learn Quran from qualified Quran teachers through live one-to-one sessions. Students can attend classes from the comfort of their homes with flexible schedules."
  },
  {
    question: "Do you provide a free trial Quran class?",
    answer:
      "Yes, we provide a free trial Quran class where students can meet their teacher, understand our learning method, and choose the right Quran or Islamic studies course according to their needs."
  },
  {
    question: "Can children and beginners learn Quran online?",
    answer:
      "Yes, our Quran learning programs are specially designed for kids, beginners, and adults. Our teachers provide step-by-step guidance to help students learn Quran reading, Tajweed rules, Islamic manners, and basic Islamic knowledge."
  },
  {
    question: "Are your Quran teachers qualified and experienced?",
    answer:
      "Our Quran teachers are experienced and trained in Quran recitation, Tajweed, Arabic, and Islamic studies. They provide personalized guidance to help students improve their Quran reading and understanding."
  },
  {
    question: "What makes your online Quran academy different?",
    answer:
      "Our online Quran academy focuses on personalized learning, qualified teachers, flexible class timings, interactive lessons, and authentic Islamic education. We help students build a strong connection with the Quran and Islamic values."
  },
  {
  question: "How do I schedule my Quran classes?",
  answer:
    "Students can choose flexible class timings that suit their daily routine and time zone. Our online Quran academy offers convenient scheduling options for learners in the USA, UK, Canada, Australia, and other countries worldwide."
},
{
  question: "Do you offer female Quran teachers for sisters ?",
  answer:
    "Yes, we provide qualified female Quran teachers for sisters and young children. Our female tutors are experienced in teaching Quran reading, Tajweed, Hifz, Arabic language, and Islamic studies in a comfortable and supportive learning environment."
}
  
];

export default function FAQ() {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index:number) => {
    setActiveIndex(
      activeIndex === index ? null : index
    );
  };


  return (
    <section className="faq-section">

      <div className="faq-container">

        <h2 className="faq-title">
          Frequently Asked Questions <br /> About Online Quran Classes
        </h2>


        <p className="faq-description">
          Find answers about our online Quran academy, Quran courses,
          experienced teachers, Tajweed classes, Islamic studies, and
          flexible learning options for students worldwide.
        </p>


        {/*<div className="faq-layout">

          <div className="faq-content">
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-card ${
                    activeIndex === index ? "active" : ""
                  }`}
                >
                  <div
                    className="faq-header"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3>{faq.question}</h3>

                    <span className="faq-icon">
                      {activeIndex === index ? "−" : "+"}
                    </span>
                  </div>

                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="faq-image-wrapper">
            <Image
              src="/assets/images/boy-1.png"
              alt="Student learning Quran online with qualified Quran teacher"
              width={600}
              height={700}
              priority
              className="faq-image"
            />
          </div>

        </div>*/}

        <div className="faq-layout">

  <div className="faq-image-wrapper">
    <Image
      src="/assets/images/faq-girl-1.jpg"
      alt="Student learning Quran online"
      width={700}
      height={400}
      className="faq-image"
    />
  </div>

  <div className="faq-column">
    {faqs.slice(0, 4).map((faq, index) => (
      <div
        key={index}
        className={`faq-card ${
          activeIndex === index ? "active" : ""
        }`}
      >
        <div
          className="faq-header"
          onClick={() => toggleFAQ(index)}
        >
          <h3>{faq.question}</h3>

          <span className="faq-icon">
            {activeIndex === index ? "−" : "+"}
          </span>
        </div>

        <div className="faq-answer">
          <p>{faq.answer}</p>
        </div>
      </div>
    ))}
  </div>

  <div className="faq-column">
    {faqs.slice(4, 8).map((faq, index) => (
      <div
        key={index + 4}
        className={`faq-card ${
          activeIndex === index + 4 ? "active" : ""
        }`}
      >
        <div
          className="faq-header"
          onClick={() => toggleFAQ(index + 4)}
        >
          <h3>{faq.question}</h3>

          <span className="faq-icon">
            {activeIndex === index + 4 ? "−" : "+"}
          </span>
        </div>

        <div className="faq-answer">
          <p>{faq.answer}</p>
        </div>
      </div>
    ))}
  </div>

</div>

      </div>

    </section>
  );
}