import Link from "next/link";

import "../pages-css/enroll.css";

export default function EnrollPage() {
  return (
    <main className="enroll-page">
      <section className="enroll-container">

        <div className="enroll-header">
          <h1>Student Enrollment Form</h1>
          <p>
            Join our Online Quran Learning Academy and start your spiritual
            learning journey with qualified teachers.
          </p>
        </div>


        <form className="enroll-form">

          {/* Student Information */}
          <div className="form-section">
            <h2>Student Information</h2>

            <div className="form-grid">

              <div className="input-group">
                <label>Full Name *</label>
                <input 
                  type="text"
                  placeholder="Enter student name"
                />
              </div>


              <div className="input-group">
                <label>Date of Birth</label>
                <input 
                  type="date"
                />
              </div>


              <div className="input-group">
                <label>Gender</label>
                <select>
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>


              <div className="input-group">
                <label>Country</label>
                <input
                  type="text"
                  placeholder="Country"
                />
              </div>


            </div>
          </div>



          {/* Parent Details */}
          <div className="form-section">

            <h2>Parent / Guardian Information</h2>

            <div className="form-grid">


              <div className="input-group">
                <label>Parent Name *</label>
                <input
                  type="text"
                  placeholder="Guardian name"
                />
              </div>


              <div className="input-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                />
              </div>


              <div className="input-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+44 / +91"
                />
              </div>


              <div className="input-group">
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="WhatsApp number"
                />
              </div>


            </div>

          </div>



          {/* Course Selection */}
          <div className="form-section">

            <h2>Select Course</h2>

            <div className="form-grid">


              <div className="input-group">

                <label>Course *</label>

                <select>

                  <option>Select Course</option>

                  <option>
                    Quran Reading (Nazra)
                  </option>

                  <option>
                    Noorani Qaida
                  </option>

                  <option>
                    Quran with Tajweed
                  </option>

                  <option>
                    Hifz Quran
                  </option>

                  <option>
                    Islamic Studies
                  </option>

                  <option>
                    Arabic Language
                  </option>

                </select>

              </div>



              <div className="input-group">

                <label>Current Level</label>

                <select>

                  <option>Beginner</option>

                  <option>Intermediate</option>

                  <option>Advanced</option>

                </select>

              </div>


            </div>

          </div>



          {/* Class Preference */}
          <div className="form-section">

            <h2>Class Preferences</h2>


            <div className="form-grid">


              <div className="input-group">

                <label>Preferred Class Time</label>

                <input
                  type="time"
                />

              </div>


              <div className="input-group">

                <label>Timezone</label>

                <select>

                  <option>
                    Select Timezone
                  </option>

                  <option>
                    UK (GMT)
                  </option>

                  <option>
                    UAE (GMT+4)
                  </option>

                  <option>
                    India (GMT+5:30)
                  </option>

                  <option>
                    USA
                  </option>

                </select>

              </div>


            </div>


            <div className="input-group textarea">

              <label>
                Additional Message
              </label>

              <textarea
                placeholder="Tell us about your learning goals..."
              />

            </div>


          </div>



          <div className="trial-box">

            <input 
              type="checkbox"
              id="trial"
            />

            <label htmlFor="trial">
              I want to book a free trial class
            </label>

          </div>



          <button className="submit-btn">
            Submit Enrollment
          </button>


        </form>


      </section>
    </main>
  );
}