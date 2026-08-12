import Link from "next/link";

import "../pages-css/teacher-registration-form.css";

export default function TeacherRegistrationPage() {
  return (
    <main className="teacher-page">

      <section className="teacher-container">


        <div className="teacher-header">

          <h1>
            Teacher Registration Form
          </h1>

          <p>
            Join our academy as a qualified Quran and Islamic Studies teacher.
            Share your knowledge with students worldwide.
          </p>

        </div>



        <form className="teacher-form">


          {/* Personal Information */}

          <div className="form-section">

            <h2>
              Personal Information
            </h2>


            <div className="form-grid">


              <div className="input-group">
                <label>Full Name *</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
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

                <label>Country</label>

                <input
                  type="text"
                  placeholder="Your country"
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

                  <option>
                    Select Gender
                  </option>

                  <option>
                    Male
                  </option>

                  <option>
                    Female
                  </option>

                </select>

              </div>


            </div>

          </div>






          {/* Islamic Qualification */}

          <div className="form-section">


            <h2>
              Islamic Qualification
            </h2>


            <div className="form-grid">


              <div className="input-group">

                <label>
                  Qualification
                </label>


                <select>

                  <option>
                    Select Qualification
                  </option>

                  <option>
                    Hafiz-e-Quran
                  </option>

                  <option>
                    Qari / Qaria
                  </option>

                  <option>
                    Alim / Alimah
                  </option>

                  <option>
                    Islamic Studies Degree
                  </option>


                </select>


              </div>



              <div className="input-group">

                <label>
                  Certificate Details
                </label>

                <input
                  type="text"
                  placeholder="Institute / Board name"
                />

              </div>


            </div>


          </div>







          {/* Teaching Experience */}

          <div className="form-section">


            <h2>
              Teaching Experience
            </h2>


            <div className="form-grid">


              <div className="input-group">

                <label>
                  Years of Experience
                </label>

                <select>

                  <option>
                    Select Experience
                  </option>

                  <option>
                    Fresher
                  </option>

                  <option>
                    1-3 Years
                  </option>

                  <option>
                    3-5 Years
                  </option>

                  <option>
                    5+ Years
                  </option>


                </select>


              </div>




              <div className="input-group">

                <label>
                  Previous Teaching Platform
                </label>

                <input
                  type="text"
                  placeholder="Academy / Online platform"
                />

              </div>



            </div>



            <div className="input-group textarea">

              <label>
                Teaching Experience Description
              </label>


              <textarea
                placeholder="Describe your teaching experience..."
              />

            </div>


          </div>







          {/* Subjects */}

          <div className="form-section">


            <h2>
              Teaching Subjects
            </h2>



            <div className="checkbox-grid">


              <label>
                <input type="checkbox"/>
                Quran Reading
              </label>


              <label>
                <input type="checkbox"/>
                Noorani Qaida
              </label>


              <label>
                <input type="checkbox"/>
                Tajweed
              </label>


              <label>
                <input type="checkbox"/>
                Hifz Quran
              </label>


              <label>
                <input type="checkbox"/>
                Arabic Language
              </label>


              <label>
                <input type="checkbox"/>
                Islamic Studies
              </label>


            </div>


          </div>








          {/* Availability */}

          <div className="form-section">


            <h2>
              Availability & Schedule
            </h2>


            <div className="form-grid">


              <div className="input-group">

                <label>
                  Timezone
                </label>


                <select>

                  <option>
                    Select Timezone
                  </option>

                  <option>
                    UK GMT
                  </option>

                  <option>
                    UAE GMT+4
                  </option>

                  <option>
                    India GMT+5:30
                  </option>


                </select>


              </div>



              <div className="input-group">

                <label>
                  Available Hours
                </label>


                <input
                  type="text"
                  placeholder="Example: 5 PM - 10 PM"
                />

              </div>



            </div>


          </div>







          {/* Online Teaching */}

          <div className="form-section">


            <h2>
              Online Teaching Setup
            </h2>


            <div className="form-grid">


              <div className="input-group">

                <label>
                  Preferred Teaching Tool
                </label>


                <select>

                  <option>
                    Zoom
                  </option>

                  <option>
                    Google Meet
                  </option>

                  <option>
                    Microsoft Teams
                  </option>


                </select>


              </div>



              <div className="input-group">

                <label>
                  Internet Speed
                </label>


                <input
                  type="text"
                  placeholder="Example: 50 Mbps"
                />

              </div>



            </div>


          </div>






          {/* Documents */}

          <div className="form-section">


            <h2>
              Documents Upload
            </h2>


            <div className="form-grid">


              <div className="input-group">

                <label>
                  Profile Photo
                </label>

                <input
                  type="file"
                />

              </div>



              <div className="input-group">

                <label>
                  Certificate Upload
                </label>

                <input
                  type="file"
                />

              </div>


            </div>


          </div>





          <div className="agree-box">

            <input type="checkbox"/>

            <span>
              I confirm that all provided information is correct.
            </span>


          </div>




          <button className="submit-btn">

            Register As Teacher

          </button>



        </form>



      </section>


    </main>
  );
}