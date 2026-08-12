// app/components/ChoosePath.js

const ChoosePath = () => {
  return (
    <section className="choose-path-section">
      <h1>Choose Your Path</h1>
      <div className="choose-path-container">
        {/* Path 1 */}
        <div className="path-card">
          <h2>📘 I want to <br /> Learn Arabic</h2>
          <p>
            Learn Arabic online with expert teachers.
            <br />
            Personalized lessons for all levels.
          </p>
          <ul className="feature-list">
            <li>✅ One-on-One Sessions</li>
            <li>✅ Qualified Arab Teachers</li>
            <li>✅ Flexible Schedule</li>
          </ul>
          <button className="learn-btn">Learn More</button>
        </div>

        {/* Path 2 */}
        <div className="path-card">
          <h2>🕌 I want to <br /> Teach Arabic</h2>
          <p>
            Share your language and culture by teaching Arabic online.
          </p>
          <ul className="feature-list">
            <li>✅ Teach from Anywhere</li>
            <li>✅ Set Your Own Schedule</li>
            <li>✅ Competitive Pay</li>
          </ul>
          <button className="teach-btn">Become a Teacher</button>
        </div>
      </div>
    </section>
  );
};

export default ChoosePath;