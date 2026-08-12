"use client";

import { useState, useEffect } from "react";
import styles from "../pages-css/Register.module.css";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Form State - Step 1
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    ageGroup: "",
    gender: "",
    phone: "",
    phoneCode: "+91",
    country: "",
  });

  // Form State - Step 2
  const [preferences, setPreferences] = useState({
    course: "quran",
    hours: 1,
    plan: "basic",
    days: [] as string[],
    preferredDate: "",
    preferredTime: "",
  });

  // Pricing Data
  const coursePrices = {
    quran: { name: "Quran", price: 8 },
    arabic: { name: "Arabic", price: 8 },
    "islamic-studies": { name: "Islamic Studies", price: 8 },
  };

  const pricingPlans = [
    { id: "basic", name: "Basic", rate: 8, multiplier: 1 },
    { id: "essentials", name: "Essentials", rate: 9, multiplier: 1.125 },
    { id: "premium", name: "Premium", rate: 11, multiplier: 1.375 },
    { id: "platinum", name: "Platinum", rate: 14, multiplier: 1.75 },
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ---- Handlers ----
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (course: string) => {
    setPreferences((prev) => ({ ...prev, course }));
  };

  const handleHoursChange = (hours: number) => {
    setPreferences((prev) => ({ ...prev, hours }));
  };

  const handlePlanChange = (plan: string) => {
    setPreferences((prev) => ({ ...prev, plan }));
  };

  const handleDayToggle = (day: string) => {
    setPreferences((prev) => {
      const maxDays = prev.hours || 7;
      const currentDays = prev.days;

      if (currentDays.includes(day)) {
        return { ...prev, days: currentDays.filter((d) => d !== day) };
      } else if (currentDays.length < maxDays) {
        return { ...prev, days: [...currentDays, day] };
      } else {
        alert(`You can only select up to ${maxDays} days based on your hours per week.`);
        return prev;
      }
    });
  };

  // ---- Navigation ----
  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate Step 1
      const { firstName, lastName, email, ageGroup, gender, phone, country } = formData;
      if (!firstName || !lastName || !email || !ageGroup || !gender || !phone || !country) {
        alert("Please fill in all required fields before proceeding.");
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ---- Submit ----
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { course, hours, days, preferredDate, preferredTime } = preferences;
    if (!course || !hours || days.length === 0 || !preferredDate || !preferredTime) {
      alert("Please fill in all fields in Step 2.");
      return;
    }
    alert("🎉 Registration complete! Thank you for joining our learning community.");
  };

  // ---- Calculate Pricing ----
  const getPricingRows = () => {
    const course = coursePrices[preferences.course as keyof typeof coursePrices];
    const courseName = course ? course.name : "No course selected";
    const coursePrice = course ? course.price : 0;

    return pricingPlans.map((plan) => {
      const monthlyTotal = preferences.hours > 0 ? preferences.hours * coursePrice * plan.multiplier : 0;
      const isSelected = preferences.plan === plan.id;

      return (
        <div
          key={plan.id}
          className={`${styles["pricing-summary-row"]} ${isSelected ? styles["selected"] : ""}`}
        >
          <div className={styles["radio-select"]}>
            <input
              type="radio"
              name="pricingPlan"
              value={plan.id}
              checked={isSelected}
              onChange={() => handlePlanChange(plan.id)}
            />
            <span className={styles["plan-name"]}>{plan.name}</span>
          </div>
          <span className={styles["plan-rate"]}>${plan.rate}/hour</span>
          <span className={`${styles["courses-list"]} ${styles["hide-mobile"]}`}>{courseName}</span>
          <span className={`${styles["hours-display"]} ${styles["hide-mobile"]}`}>
            {preferences.hours > 0 ? `${preferences.hours}h` : "—"}
          </span>
          <span className={styles["total-price"]}>${monthlyTotal.toFixed(2)}</span>
        </div>
      );
    });
  };

  // ---- Days Limiter ----
  const isDayDisabled = (day: string) => {
    const maxDays = preferences.hours || 7;
    const selectedDays = preferences.days.length;
    return selectedDays >= maxDays && !preferences.days.includes(day);
  };

  return (
    <div className={styles["registration-wrapper"]}>
      {/* HEADER */}
      <div className={styles["registration-header"]}>
        <h2>Student Registration</h2>
        <p>Join our learning community</p>
      </div>

      {/* PROGRESS STEPS */}
      <div className={styles["progress-steps"]}>
        <div className={styles["step-item"]}>
          <div
            className={`${styles["step-number"]} ${
              currentStep === 1 ? styles["active"] : styles["completed"]
            }`}
          >
            <span>1</span>
          </div>
          <span className={`${styles["step-label"]} ${currentStep === 1 ? styles["active"] : ""}`}>
            Step 1 – Your Details
          </span>
        </div>
        <div className={`${styles["step-line"]} ${currentStep === 2 ? styles["active"] : ""}`}></div>
        <div className={styles["step-item"]}>
          <div
            className={`${styles["step-number"]} ${currentStep === 2 ? styles["active"] : ""}`}
          >
            <span>2</span>
          </div>
          <span className={`${styles["step-label"]} ${currentStep === 2 ? styles["active"] : ""}`}>
            Step 2 – Preferences
          </span>
        </div>
      </div>

      <form className={styles["registration-form"]} onSubmit={handleSubmit}>
        {/* ===== STEP 1 ===== */}
        <div className={`${styles["step-content"]} ${currentStep === 1 ? styles["active"] : ""}`}>
          <div className={styles["step-title-wrapper"]}>
            <div className={styles["icon-box"]}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3>Tell us about yourself</h3>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>First Name <span className={styles["required"]}>*</span></label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label>Last Name <span className={styles["required"]}>*</span></label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
            <label>Email <span className={styles["required"]}>*</span></label>
            <div className={styles["input-with-icon"]}>
              <svg className={styles["input-icon"]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Select Age Group <span className={styles["required"]}>*</span></label>
              <select name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} required>
                <option value="">Select Age Group</option>
                <option value="5-10">5-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16-18">16-18 years</option>
                <option value="19-25">19-25 years</option>
                <option value="25+">25+ years</option>
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label>Gender <span className={styles["required"]}>*</span></label>
              <div className={styles["radio-group"]}>
                <label>
                  <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleInputChange} />
                  Male
                </label>
                <label>
                  <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleInputChange} />
                  Female
                </label>
              </div>
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Phone / Mobile <span className={styles["required"]}>*</span></label>
              <div className={styles["phone-group"]}>
                <select name="phoneCode" value={formData.phoneCode} onChange={handleInputChange}>
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+86">+86</option>
                  <option value="+81">+81</option>
                  <option value="+49">+49</option>
                  <option value="+33">+33</option>
                  <option value="+971">+971</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone / Mobile"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className={styles["form-group"]}>
              <label>Country <span className={styles["required"]}>*</span></label>
              <select name="country" value={formData.country} onChange={handleInputChange} required>
                <option value="">Select Country</option>
                <option value="india">India</option>
                <option value="usa">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="germany">Germany</option>
                <option value="france">France</option>
                <option value="uae">UAE</option>
                <option value="singapore">Singapore</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== STEP 2 ===== */}
        <div className={`${styles["step-content"]} ${currentStep === 2 ? styles["active"] : ""}`}>
          <div className={styles["step-title-wrapper"]}>
            <div className={styles["icon-box"]}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3>Customize your experience</h3>
          </div>

          {/* Course Selection */}
          <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
            <label>Select the Course <span className={styles["required"]}>*</span></label>
            <div className={styles["course-grid"]}>
              {Object.entries(coursePrices).map(([key, value]) => (
                <div
                  key={key}
                  className={`${styles["course-option"]} ${preferences.course === key ? styles["selected"] : ""}`}
                  onClick={() => handleCourseChange(key)}
                >
                  <input
                    type="radio"
                    name="course"
                    value={key}
                    checked={preferences.course === key}
                    onChange={() => handleCourseChange(key)}
                  />
                  <label>{value.name}</label>
                </div>
              ))}
            </div>
            <span className={styles["info-text"]}>Select one course</span>
          </div>

          {/* Hours Per Week */}
          <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
            <label>How Many Hours per Week? <span className={styles["required"]}>*</span></label>
            <div className={styles["hours-grid"]}>
              {[1, 2, 3, 4, 5, 6, 7].map((hour) => (
                <div
                  key={hour}
                  className={`${styles["hour-option"]} ${preferences.hours === hour ? styles["selected"] : ""}`}
                  onClick={() => handleHoursChange(hour)}
                >
                  <input type="radio" name="hours" value={hour} checked={preferences.hours === hour} onChange={() => handleHoursChange(hour)} />
                  {hour}
                </div>
              ))}
            </div>
            <span className={styles["info-text"]}>Choose how many hours per week you want to study</span>
          </div>

          {/* Pricing Summary */}
          <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
            <label>Course Pricing Summary</label>
            <div className={styles["pricing-summary-container"]}>
              <div className={styles["pricing-summary-header"]}>
                <span>Plan</span>
                <span>Rate</span>
                <span className={styles["hide-mobile"]}>Course</span>
                <span className={styles["hide-mobile"]}>Hours</span>
                <span>Total / Month</span>
              </div>
              {getPricingRows()}
            </div>
          </div>

          {/* Days of Week */}
          <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
            <label>Which Days Work Best for You? <span className={styles["required"]}>*</span></label>
            <div className={styles["days-grid"]}>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className={`${styles["day-option"]} ${preferences.days.includes(day) ? styles["selected"] : ""} ${isDayDisabled(day) ? styles["disabled"] : ""}`}
                  onClick={() => !isDayDisabled(day) && handleDayToggle(day)}
                >
                  <input type="checkbox" value={day} checked={preferences.days.includes(day)} onChange={() => {}} />
                  {day}
                </div>
              ))}
            </div>
            <span className={styles["info-text"]} id="daysInfo">
              Select up to {preferences.hours || 7} days based on your hours per week ({preferences.days.length}/{preferences.hours || 7} selected)
            </span>
          </div>

          {/* Preferred Date & Time */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Preferred Date <span className={styles["required"]}>*</span></label>
              <input
                type="date"
                value={preferences.preferredDate}
                onChange={(e) => setPreferences((prev) => ({ ...prev, preferredDate: e.target.value }))}
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label>Preferred Time <span className={styles["required"]}>*</span></label>
              <input
                type="time"
                value={preferences.preferredTime}
                onChange={(e) => setPreferences((prev) => ({ ...prev, preferredTime: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        {/* ===== FORM ACTIONS ===== */}
        <div className={styles["form-actions"]}>
          <button type="button" className={styles["btn-back"]} onClick={prevStep} disabled={currentStep === 1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          {currentStep === 1 ? (
            <button type="button" className={styles["btn-next"]} onClick={nextStep}>
              Next Step
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          ) : (
            <button type="submit" className={styles["btn-submit"]}>
              Complete Registration
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}