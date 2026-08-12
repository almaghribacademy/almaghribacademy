import "../sections-css/Achievements.css";
const stats = [
  ["5,000+", "Successful Online Quran Learning Sessions"],
  ["99+", "Students Enrolled Across Many Countries"],
  ["20+", "Qualified Quran, Arabic And Islamic Instructors"],
  ["4.9/5", "Trusted By Students And Families Worldwide"],
];

export default function Achievements() {
  return (
    <section className="impact-section">
      <div className="impact-container">

        {/*<span className="impact-subtitle">
          Trusted by Muslim Families Worldwide
        </span>*/}

        <h2 className="impact-title">
          Empowering Students Through <br /> Online Quran Classes <br /> Arabic Courses & <br /> Islamic Studies Education.
        </h2>

        <p className="impact-description">
          Join thousands of students who have transformed their learning journey
          through our Online Quran Classes, Tajweed Courses, Hifz Programs,
          Arabic Language Learning, and Islamic Studies taught by qualified
          male and female teachers.
        </p>

        <div className="impact-grid">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="impact-card"
            >
              <h3 className="impact-value">
                {value}
              </h3>

              <p className="impact-label">
                {label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}