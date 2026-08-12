import "../sections-css/IslamicPractices.css";

const practices = [
  {
    title: "Salah (Prayer)",
    icon: "🕌",
    description:
      "Learn the importance of daily Salah and develop a strong connection with Allah through proper Islamic prayer practices.",
  },
  {
    title: "Quran Recitation",
    icon: "📖",
    description:
      "Improve Quran reading skills with proper Tajweed rules, pronunciation, and guidance from experienced Quran teachers.",
  },
  {
    title: "Daily Duas",
    icon: "🤲",
    description:
      "Learn authentic Islamic duas for everyday life and build a habit of remembering Allah in every situation.",
  },
  {
    title: "Dhikr & Remembrance",
    icon: "✨",
    description:
      "Understand the benefits of Dhikr and develop spiritual mindfulness through regular remembrance of Allah.",
  },
  {
    title: "Islamic Manners & Character",
    icon: "❤️",
    description:
      "Develop excellent Islamic values, good manners, honesty, kindness, and respect through Islamic teachings.",
  },
  {
    title: "Charity & Giving",
    icon: "🎁",
    description:
      "Learn the importance of Sadaqah, generosity, and helping others according to Islamic principles.",
  },
];

export default function IslamicPractices() {
  return (
    <section className="islamic-practices-section">
      <div className="islamic-practices-container">
        <h2 className="islamic-practices-title">
          Learn Essential Islamic Practices <br /> & Build Strong Faith
        </h2>

        <p className="islamic-practices-description">
          Our Islamic education programs help students understand and practice
          important aspects of Islam, including Quran recitation, Salah,
          Duas, Dhikr, Islamic manners, and daily spiritual habits. Learn
          authentic Islamic teachings with guidance from qualified teachers.
        </p>

        <div className="islamic-practices-grid">
          {practices.map((practice) => (
            <div
              key={practice.title}
              className="islamic-practice-card"
            >
              <div className="islamic-practice-icon">
                {practice.icon}
              </div>

              <h3 className="islamic-practice-name">
                {practice.title}
              </h3>

              <p className="islamic-practice-text">
                {practice.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}