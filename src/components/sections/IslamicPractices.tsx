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
    <section className="practices-section">

      <div className="practices-container">

        <h2 className="practices-title">
          Learn Essential Islamic Practices <br /> & Build Strong Faith
        </h2>


        <p className="practices-description">
          Our Islamic education programs help students understand and practice
          important aspects of Islam, including Quran recitation, Salah,
          Duas, Dhikr, Islamic manners, and daily spiritual habits. Learn
          authentic Islamic teachings with guidance from qualified teachers.
        </p>


        {/*<div className="practices-grid">

          {practices.map((item) => (

            <div
              key={item.title}
              className="practice-card"
            >

              <div className="practice-icon">
                {item.icon}
              </div>


              <h3 className="practice-name">
                {item.title}
              </h3>


              <p className="practice-text">
                {item.description}
              </p>


            </div>

          ))}
        </div>*/}
        <div className="features-grid">
          {practices.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
            >
              <div className="practice-icon">
                {feature.icon}
              </div>

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