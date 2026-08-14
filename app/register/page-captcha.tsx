"use client";
import "../pages-css/trial-form.css";
import { useState } from "react";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import Swal from "sweetalert2";
import Turnstile from "react-turnstile";

export default function TrialForm() {
  
  const [captchaToken, setCaptchaToken] =
  useState("");

  const today = new Date()
  .toISOString()
  .split("T")[0];

  const currentTime = new Date()
  .toTimeString()
  .slice(0, 5);

  const [countryCode, setCountryCode] =
  useState("+44");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      preferredDate: today,
      preferredTime: currentTime,
    });

  const nextStep = () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
    } = formData;

    /* Required Validation */
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !country.trim()
    ) {
      
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please fill all required fields.",
      });
      return;
    }

    /* First Name Validation */
    const nameRegex = /^[A-Za-z]+$/;

    if (!nameRegex.test(firstName.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid First Name",
        text: "First Name must contain only letters.",
      });
      return;
    }

    /* Last Name Validation */
    if (!nameRegex.test(lastName.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Last Name",
        text: "Last Name must contain only letters.",
      });
      return;
    }

    /* Email Validation */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    /* Phone Validation */
    const phoneRegex = /^[1-9][0-9]{6,14}$/;

    if (!phoneRegex.test(phone.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Phone number must contain 7 to 15 digits.",
      });
      return;
    }

    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const [selected, setSelected] = useState<{
    [key: string]: string;
  }>({});

  const handleSelect = (
    group: string,
    value: string
  ) => {
    setSelected((prev) => ({
      ...prev,
      [group]: value,
    }));
  };


  const handleSubmit = async () => {
    // Validate captcha FIRST
    if (!captchaToken) {
      Swal.fire({
        icon: "warning",
        title: "Verification Required",
        text: "Please complete the security verification.",
      });
      return;
    }

    if (!selected.course) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please select a course.",
      });
      return;
    }

    if (!selected.session) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please select who the trial is for.",
      });
      return;
    }

    if (!selected.teacher) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please select a preferred teacher.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("/api/trial-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captchaToken,
          phone: `${countryCode}${formData.phone}`,
          course: selected.course,
          session: selected.session,
          teacher: selected.teacher,
          source: selected.source || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Booking Submitted! 🎉",
          text: "Your trial booking has been submitted. We'll contact you within 24 hours.",
          confirmButtonColor: "#1a1a2e",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          preferredDate: today,
          preferredTime: currentTime,
        });
        setSelected({});
        setStep(1);
        setCountryCode("+44");
        setCaptchaToken("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.message || "Failed to submit booking. Please try again.",
          confirmButtonColor: "#1a1a2e",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#1a1a2e",
      });
    } finally {
      setLoading(false);
    }
  };  

  

  return (
    <>
    <Header />
    <div className="form-wrapper">

      {/* Progress */}

      <div className="progress-wrapper">

        <div className="progress-head">
          <span>Step 1 — Your Details</span>
          <span>Step 2 — Preferences</span>
        </div>

        <div className="progress">

          <div
            className={`circle ${
              step >= 1 ? "active" : ""
            }`}
          />

          <div
            className={`line ${
              step === 2 ? "active" : ""
            }`}
          />

          <div
            className={`circle ${
              step === 2 ? "active" : ""
            }`}
          />

        </div>

      </div>

      {/* STEP 1 */}

      {step === 1 && (
        <div>

          <h2 className="step-title">
            Tell us about yourself
          </h2>

          <div className="form-grid">

            <div className="form-group">
              <label>
                First Name
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value.replace(
                      /[^A-Za-z]/g,
                      ""
                    ),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>
                Last Name
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value.replace(
                      /[^A-Za-z]/g,
                      ""
                    ),
                  })
                }
              />
            </div>

            <div className="form-group full">
              <label>
                Email
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="email"
                placeholder="Enter Your Emai Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group full">
              <label>
                Phone
                <span className="required">*</span>
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <select
                  value={countryCode}
                  onChange={(e) =>
                    setCountryCode(e.target.value)
                  }
                >
                  <option value="+44">🇬🇧 United Kingdom (+44)</option>
                  <option value="+1">🇺🇸 United States (+1)</option>
                  <option value="+91">🇮🇳 India (+91)</option>
                  <option value="+61">🇦🇺 Australia (+61)</option>
                  <option value="+1">🇨🇦 Canada (+1)</option>
                </select>

                <input
                  type="tel"
                  placeholder="Enter Your Contact No."
                  maxLength={15}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      ),
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group full">
              <label>
                Country
                <span className="required">
                  *
                </span>
              </label>

              <select
                value={formData.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    country: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Country
                </option>
                <option>India</option>
                <option>
                  United Kingdom
                </option>
                <option>
                  United States
                </option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </div>

          </div>

          <div className="btn-row">
            <button
              className="btn next-btn"
              onClick={nextStep}
            >
              Next Step →
            </button>
          </div>

        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <div>

          <h2 className="step-title">
            Your Learning Preferences
          </h2>

          <div className="form-grid">

            <div className="form-group full">
              <label>
                What would you like to learn?
                <span className="required">
                  *
                </span>
              </label>

              <div className="option-row">
                {[
                  "Quran",
                  "Arabic Language",
                  "Islamic Studies",
                ].map((item) => (
                  <label
                    key={item}
                    className={`option ${
                      selected.course === item
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelect(
                        "course",
                        item
                      )
                    }
                  >
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>
                This trial session is for?
                <span className="required">
                  *
                </span>
              </label>

              <div className="option-row">
                {[
                  "Myself",
                  "Family Member",
                ].map((item) => (
                  <label
                    key={item}
                    className={`option ${
                      selected.session === item
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelect(
                        "session",
                        item
                      )
                    }
                  >
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>
                Your preferred teacher
                <span className="required">
                  *
                </span>
              </label>

              <div className="option-row">
                {[
                  "Male",
                  "Female",
                  "Either",
                ].map((item) => (
                  <label
                    key={item}
                    className={`option ${
                      selected.teacher === item
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelect(
                        "teacher",
                        item
                      )
                    }
                  >
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>
                How did you find us?
              </label>

              <div className="option-row">
                {[
                  "Friends",
                  "Social Media",
                  "Email",
                  "Google",
                  "Others",
                ].map((item) => (
                  <label
                    key={item}
                    className={`option ${
                      selected.source === item
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelect(
                        "source",
                        item
                      )
                    }
                  >
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>
                Preferred Date
              </label>
              <input
                type="date"
                placeholder="Choose a Date"
                min={today}
                value={formData.preferredDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>
                Preferred Time
              </label>
              <input
                type="time"
                placeholder="Choose a preferred time slot"
                value={formData.preferredTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredTime: e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="button-group">

            <button
              className="btn prev-btn"
              onClick={prevStep}
            >
              Previous
            </button>

            <Turnstile
              sitekey={
                process.env
                  .NEXT_PUBLIC_TURNSTILE_SITE_KEY!
              }
              onVerify={(token) =>
                setCaptchaToken(token)
              }
            />

            <button
              type="button"
              className="btn submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Booking →"}
            </button>

          </div>

        </div>
      )}
    </div>
    <Footer />
  </>
  );
}