import "../sections-css/WhyChooseUs.css";
const features = [
  {
    title: "Certified Expert Quran Teachers",
    description:
      "Learn from experienced certified teachers delivering personalized Quran and Arabic education daily.",
  },
  {
    title: "Flexible Class Schedule Options",
    description:
      "Choose convenient timings supporting students worldwide with flexible online learning everyweek seamlessly.",
  },
  {
    title: "Personalized Quran Lessons",
    description:
      "Receive dedicated one-on-one instruction improving recitation confidence and consistent learning progress.",
  },
  {
    title: "Qualified Female Quran Teachers",
    description:
      "Female instructors provide comfortable supportive learning environments for sisters and young learners.",
  },
  {
    title: "Global Student Learning Support",
    description:
      "Access reliable educational guidance across countries through engaging virtual Quran classrooms daily.",
  },
  {
    title: "Consistent Student Progress Tracking",
    description:
      "Monitor Quran memorization, Arabic improvement, and Islamic studies with regular assessments consistently.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="features-section">
      <div className="features-container">

        {/*<span className="features-subtitle">
          Why Students Choose Us
        </span>*/}

        <h2 className="features-title">
          Why Choose AlMaghrib Academy <br /> Online Quran Classes <br /> Arabic Courses & <br />Islamic Studies?
        </h2>

        <p className="features-intro">
          At AlMaghrib Academy, we combine qualified teachers, personalized learning,
          and flexible online classes to help students of all ages build a
          strong connection with the Quran, Arabic language, and Islamic knowledge.
        </p>

        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
            >
              <h3 className="feature-heading">
                {feature.title}
              </h3>

              <p className="feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}