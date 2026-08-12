import "../sections-css/Reviews.css";
const reviews = [
  {
    name: "Ahmed Rahman",
    text: "AlMaghrib Academy provides excellent online Quran classes with highly qualified teachers. The flexible schedules and personalized learning approach helped me improve my Quran recitation and understanding.",
  },
  {
    name: "Fatima Khan",
    text: "My children love their Quran learning journey at AlMaghrib Academy. The experienced Quran teachers make Islamic education engaging, easy to understand, and suitable for kids learning from home.",
  },
  {
    name: "Ayesha Malik",
    text: "A trusted online Islamic academy with professional teachers, structured Quran courses, and excellent student support. The lessons have helped me learn Quran with proper Tajweed and confidence.",
  },
];

export default function Reviews() {
  return (
    <section className="reviews-section">
      <div className="reviews-container">

        <h2 className="reviews-title">
          Trusted Online Quran Academy <br /> Loved by Families Worldwide
        </h2>

        <p className="reviews-description">
          Thousands of students and families trust AlMaghrib Academy for
          professional online Quran classes, Islamic studies, and expert Quran
          teachers. Our flexible learning programs help children and adults
          learn Quran with Tajweed from anywhere in the world.
        </p>

        <div className="reviews-grid">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="review-card"
            >

              <div className="review-stars">
                ★★★★★
              </div>

              <p className="review-text">
                {review.text}
              </p>

              <h4 className="review-name">
                {review.name}
              </h4>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}