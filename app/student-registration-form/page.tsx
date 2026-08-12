"use client";

import { useState, useEffect } from "react";
import "../pages-css/student-registration-form.css";
import Swal from "sweetalert2";

export default function RegisterPage() {
  // ---- Date & Time Setup ----
  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  
  const maxDateObj = new Date(tomorrow);
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const getDefaultTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    let selectedMinutes = minutes >= 30 ? 30 : 0;
    let hour12 = now.getHours() % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${String(selectedMinutes).padStart(2, '0')}`;
  };

  // ---- State ----
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [detectedCountry, setDetectedCountry] = useState<string>("");
  const [detectedCountryCode, setDetectedCountryCode] = useState<string>("+44");
  const [loading, setLoading] = useState(false);
  const [ampm, setAmpm] = useState(() => {
    const now = new Date();
    return now.getHours() >= 12 ? 'PM' : 'AM';
  });

  // Form State - Step 1 (Matches your schema)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    alternativePhone: "",
    country: "",
    gender: "",
  });

  // Form State - Step 2
  const [preferences, setPreferences] = useState({
    courseId: 1,
    hours: 1,
    plan: "basic",
    days: [] as string[],
    trialDate: tomorrowStr,
    preferredTime: getDefaultTime(),
  });

  // Errors State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ---- Country Codes ----
  const countryCodes = [
    { code: "+93" }, { code: "+355" }, { code: "+213" }, { code: "+376" },
    { code: "+244" }, { code: "+54" }, { code: "+374" }, { code: "+61" },
    { code: "+43" }, { code: "+994" }, { code: "+973" }, { code: "+880" },
    { code: "+375" }, { code: "+32" }, { code: "+975" }, { code: "+591" },
    { code: "+387" }, { code: "+55" }, { code: "+673" }, { code: "+359" },
    { code: "+226" }, { code: "+855" }, { code: "+237" }, { code: "+1" },
    { code: "+56" }, { code: "+86" }, { code: "+57" }, { code: "+506" },
    { code: "+385" }, { code: "+53" }, { code: "+357" }, { code: "+420" },
    { code: "+45" }, { code: "+593" }, { code: "+20" }, { code: "+372" },
    { code: "+251" }, { code: "+679" }, { code: "+358" }, { code: "+33" },
    { code: "+241" }, { code: "+220" }, { code: "+995" }, { code: "+49" },
    { code: "+233" }, { code: "+30" }, { code: "+502" }, { code: "+224" },
    { code: "+592" }, { code: "+509" }, { code: "+504" }, { code: "+36" },
    { code: "+354" }, { code: "+91" }, { code: "+62" }, { code: "+98" },
    { code: "+964" }, { code: "+353" }, { code: "+972" }, { code: "+39" },
    { code: "+81" }, { code: "+962" }, { code: "+7" }, { code: "+254" },
    { code: "+965" }, { code: "+996" }, { code: "+856" }, { code: "+371" },
    { code: "+961" }, { code: "+218" }, { code: "+370" }, { code: "+352" },
    { code: "+261" }, { code: "+265" }, { code: "+60" }, { code: "+960" },
    { code: "+223" }, { code: "+356" }, { code: "+222" }, { code: "+52" },
    { code: "+373" }, { code: "+377" }, { code: "+976" }, { code: "+382" },
    { code: "+212" }, { code: "+258" }, { code: "+95" }, { code: "+264" },
    { code: "+977" }, { code: "+31" }, { code: "+64" }, { code: "+505" },
    { code: "+234" }, { code: "+47" }, { code: "+968" }, { code: "+92" },
    { code: "+970" }, { code: "+507" }, { code: "+675" }, { code: "+595" },
    { code: "+51" }, { code: "+63" }, { code: "+48" }, { code: "+351" },
    { code: "+974" }, { code: "+40" }, { code: "+966" }, { code: "+221" },
    { code: "+381" }, { code: "+248" }, { code: "+65" }, { code: "+421" },
    { code: "+386" }, { code: "+677" }, { code: "+252" }, { code: "+27" },
    { code: "+82" }, { code: "+34" }, { code: "+94" }, { code: "+249" },
    { code: "+597" }, { code: "+46" }, { code: "+41" }, { code: "+963" },
    { code: "+886" }, { code: "+992" }, { code: "+255" }, { code: "+66" },
    { code: "+228" }, { code: "+216" }, { code: "+90" }, { code: "+993" },
    { code: "+256" }, { code: "+380" }, { code: "+971" }, { code: "+44" },
    { code: "+598" }, { code: "+998" }, { code: "+58" }, { code: "+84" },
    { code: "+967" }, { code: "+260" }, { code: "+263" }
  ];

  const uniqueCountryCodes = countryCodes.filter(
    (code, index, self) => 
      index === self.findIndex((c) => c.code === code.code)
  );

  const countryToCodeMap: { [key: string]: string } = {
    "United Kingdom": "+44", "United States": "+1", "India": "+91",
    "Australia": "+61", "Canada": "+1", "Pakistan": "+92",
    "Bangladesh": "+880", "UAE": "+971", "Saudi Arabia": "+966",
    "Egypt": "+20", "Morocco": "+212", "Nigeria": "+234",
    "South Africa": "+27", "New Zealand": "+64", "Singapore": "+65",
    "Malaysia": "+60", "Indonesia": "+62", "Sri Lanka": "+94",
    "Nepal": "+977", "China": "+86", "Germany": "+49",
    "France": "+33", "Italy": "+39", "Spain": "+34",
    "Turkey": "+90", "Russia": "+7", "Ukraine": "+380",
  };

  // ---- Pricing Data ----
  const coursePrices = {
    quran: { id: 1, name: "Quran", price: 8 },
    arabic: { id: 2, name: "Arabic", price: 8 },
    "islamic-studies": { id: 3, name: "Islamic Studies", price: 8 },
  };

  const pricingPlans = [
    { id: "basic", name: "Basic", rate: 8, multiplier: 1 },
    { id: "essentials", name: "Essentials", rate: 9, multiplier: 1.125 },
    { id: "premium", name: "Premium", rate: 11, multiplier: 1.375 },
    { id: "platinum", name: "Platinum", rate: 14, multiplier: 1.75 },
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
    "Australia", "Austria", "Bangladesh", "Belgium", "Brazil", "Canada",
    "China", "Denmark", "Egypt", "Finland", "France", "Germany", "Ghana",
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Japan", "Jordan", "Kenya", "Kuwait", "Lebanon", "Malaysia", "Mexico",
    "Morocco", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
    "Pakistan", "Philippines", "Portugal", "Qatar", "Russia", "Saudi Arabia",
    "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka",
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand",
    "Turkey", "UAE", "Uganda", "Ukraine", "United Kingdom", "United States",
    "Uruguay", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const timeOptions = [];
  for (let hour = 0; hour < 12; hour++) {
    const hourStr = hour === 0 ? '12' : String(hour).padStart(2, '0');
    timeOptions.push(`${hourStr}:00`);
    timeOptions.push(`${hourStr}:30`);
  }

  // ---- Auto-detect country ----
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_name) {
          const countryName = data.country_name;
          setDetectedCountry(countryName);
          const matchedCode = countryToCodeMap[countryName];
          if (matchedCode) {
            setDetectedCountryCode(matchedCode);
            setFormData(prev => ({
              ...prev,
              country: countryName,
            }));
          }
        }
      } catch (error) {
        console.log("Could not detect country automatically");
      }
    };
    detectCountry();
  }, []);

  // ---- Validation ----
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "firstName":
        if (!value || !value.trim()) return "First name is required";
        if (!/^[A-Za-z\s'-]{2,50}$/.test(value.trim())) {
          return "First name must contain only letters (2-50 characters)";
        }
        return "";
      case "lastName":
        if (!value || !value.trim()) return "Last name is required";
        if (!/^[A-Za-z\s'-]{2,50}$/.test(value.trim())) {
          return "Last name must contain only letters (2-50 characters)";
        }
        return "";
      case "email":
        if (!value || !value.trim()) return "Email is required";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) {
          return "Please enter a valid email address";
        }
        return "";
      case "phone":
        if (!value || !value.trim()) return "Phone number is required";
        if (!/^[0-9]{7,15}$/.test(value.trim())) {
          return "Phone must contain 7-15 digits";
        }
        return "";
      case "country":
        if (!value) return "Country is required";
        return "";
      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        return "";
      case "gender":
        if (!value) return "Gender is required";
        return "";
      default:
        return "";
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const fields = ["firstName", "lastName", "email", "phone", "country", "dateOfBirth", "gender"];
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---- Handlers ----
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    const code = countryToCodeMap[selectedCountry] || "";
    setFormData({ ...formData, country: selectedCountry });
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: "" }));
    }
    if (code) {
      setDetectedCountryCode(code);
    }
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
    if (errors.gender) {
      setErrors({ ...errors, gender: "" });
    }
  };

  const handleCourseChange = (course: string) => {
    setPreferences((prev) => ({ ...prev, courseId: coursePrices[course as keyof typeof coursePrices].id }));
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
      if (!validateStep1()) {
        const firstError = Object.keys(errors)[0];
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          (element as HTMLElement).focus();
        }
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

  // ---- Submit with API Integration ----
  // ---- Submit with API Integration ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { courseId, hours, days, trialDate, preferredTime } = preferences;
    if (!courseId || !hours || days.length === 0 || !trialDate || !preferredTime) {
      alert("Please fill in all fields in Step 2.");
      return;
    }

    setLoading(true);

    try {
      // Format time to 24-hour format
      const timeStr = preferences.preferredTime;
      const [hours12, minutes] = timeStr.split(":");
      let hour24 = parseInt(hours12);
      if (ampm === "PM" && hour24 !== 12) hour24 += 12;
      if (ampm === "AM" && hour24 === 12) hour24 = 0;
      const time24 = `${String(hour24).padStart(2, "0")}:${minutes}`;

      // Get course name
      const courseName = Object.values(coursePrices).find(c => c.id === courseId)?.name || "";

      // Prepare data for API
      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        alternativePhone: formData.alternativePhone || null,
        country: formData.country,
        gender: formData.gender,
        courseId: courseId,
        trialDate: trialDate,
        preferredTime: time24,
        ampm: ampm,
        hoursPerWeek: hours,
        pricingPlan: preferences.plan,
        preferredDays: days,
        courseName: courseName,
      };

      // Send to API
      const response = await fetch("/api/student-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      // ✅ Handle email exists error
      if (response.status === 409 && data.code === "EMAIL_EXISTS") {
        Swal.fire({
          icon: "warning",
          title: "Email Already Registered",
          text: data.message,
          confirmButtonColor: "#0a2e7a",
          confirmButtonText: "Got it",
        });
        return;
      }

      if (response.ok) {
        Swal.fire({
          title: "Registration Complete!",
          html: `
            <div style="text-align:center;">
              <p style="color:#333; font-size:16px; line-height:1.8; margin:0;">
                Your registration has been submitted successfully!<br />
                <span style="color:#0a2e7a; font-weight:600;">
                  📞 We'll contact you within 24 hours.
                </span>
              </p>
            </div>
          `,
          icon: "success",
          confirmButtonText: "Great, Thanks!",
          confirmButtonColor: "#0a2e7a",
          customClass: {
            popup: "custom-swal-popup",
            confirmButton: "custom-swal-confirm",
          },
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.message || "Failed to submit registration. Please try again.",
          confirmButtonColor: "#0a2e7a",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#0a2e7a",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---- Calculate Pricing ----
  const getPricingRows = () => {
    const course = Object.values(coursePrices).find(c => c.id === preferences.courseId);
    const courseName = course ? course.name : "No course selected";
    const coursePrice = course ? course.price : 0;

    return pricingPlans.map((plan) => {
      const monthlyTotal = preferences.hours > 0 ? preferences.hours * coursePrice * plan.multiplier : 0;
      const isSelected = preferences.plan === plan.id;

      return (
        <div
          key={plan.id}
          className={`pricing-summary-row ${isSelected ? "selected" : ""}`}
          onClick={() => handlePlanChange(plan.id)}
        >
          <div className="radio-select">
            <label className="custom-radio">
              <input
                type="radio"
                name="pricingPlan"
                value={plan.id}
                checked={isSelected}
                onChange={() => handlePlanChange(plan.id)}
              />
              <span className="radio-checkmark"></span>
              <span className="plan-name">{plan.name}</span>
            </label>
          </div>
          <span className="plan-rate">${plan.rate}/hour</span>
          <span className="courses-list hide-mobile">{courseName}</span>
          <span className="hours-display hide-mobile">
            {preferences.hours > 0 ? `${preferences.hours}h` : "—"}
          </span>
          <span className="total-price">${monthlyTotal.toFixed(2)}</span>
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
    <>
      {/* Loader */}
      {loading && (
        <div className="custom-loader-overlay">
          <div className="custom-loader">
            <h3>Submitting Your Registration...</h3>
            <p>Please wait a moment.</p>
            <div className="loader-spinner"></div>
          </div>
        </div>
      )}

      <div className="form-wrapper">
        {/* PROGRESS */}
        <div className="progress-wrapper">
          <div className="progress-head">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{currentStep === 1 ? "Your Details" : "Preferences"}</span>
          </div>
          <div className="progress">
            <div className={`circle ${currentStep >= 1 ? "active" : ""}`}></div>
            <div className={`line ${currentStep >= 2 ? "active" : ""}`}></div>
            <div className={`circle ${currentStep >= 2 ? "active" : ""}`}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ===== STEP 1 ===== */}
          {currentStep === 1 && (
            <div>
              <h2 className="step-title">Tell us about yourself</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    className={errors.firstName ? "error" : ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value.replace(/[^A-Za-z\s'-]/g, ""))
                    }
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label>Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    className={errors.lastName ? "error" : ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value.replace(/[^A-Za-z\s'-]/g, ""))
                    }
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>

                <div className="form-group">
                  <label>Date of Birth <span className="required">*</span></label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    className={errors.dateOfBirth ? "error" : ""}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group">
                  <label>Gender <span className="required">*</span></label>
                  <div className="gender-selector">
                    <button
                      type="button"
                      className={`gender-option ${formData.gender === "male" ? "active" : ""}`}
                      onClick={() => handleGenderSelect("male")}
                    >
                      <span className="gender-icon">👤</span>
                      <span className="gender-label">Male</span>
                    </button>
                    <button
                      type="button"
                      className={`gender-option ${formData.gender === "female" ? "active" : ""}`}
                      onClick={() => handleGenderSelect("female")}
                    >
                      <span className="gender-icon">👩</span>
                      <span className="gender-label">Female</span>
                    </button>
                  </div>
                  {errors.gender && <span className="error-message">{errors.gender}</span>}
                </div>

                <div className="form-group full">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    value={formData.email}
                    className={errors.email ? "error" : ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone / Mobile <span className="required">*</span></label>
                  <div className="phone-wrapper">
                    <div className="select-wrapper" style={{ width: "100px", flexShrink: 0 }}>
                      <select
                        value={detectedCountryCode}
                        onChange={(e) => setDetectedCountryCode(e.target.value)}
                      >
                        {uniqueCountryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code}
                          </option>
                        ))}
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter Your Contact No."
                      maxLength={15}
                      value={formData.phone}
                      className={errors.phone ? "error" : ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value.replace(/[^0-9]/g, ""))
                      }
                      style={{ flex: 1 }}
                    />
                  </div>
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Alternative Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter Alternative Phone"
                    maxLength={15}
                    value={formData.alternativePhone}
                    onChange={(e) =>
                      handleInputChange("alternativePhone", e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>

                <div className="form-group full">
                  <label>Country <span className="required">*</span></label>
                  <div className="select-wrapper">
                    <select
                      value={formData.country}
                      onChange={handleCountryChange}
                      className={errors.country ? "error" : ""}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>
              </div>

              <div className="btn-row">
                <button className="btn next-btn" onClick={nextStep}>
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2 ===== */}
          {currentStep === 2 && (
            <div>
              <h2 className="step-title">Customize your experience</h2>

              <div className="form-grid">
                <div className="form-group full">
                  <label>Select the Course <span className="required">*</span></label>
                  <div className="option-row">
                    {Object.entries(coursePrices).map(([key, value]) => (
                      <div
                        key={key}
                        className={`option ${preferences.courseId === value.id ? "active" : ""}`}
                        onClick={() => handleCourseChange(key)}
                      >
                        <input
                          type="radio"
                          name="course"
                          value={value.id}
                          checked={preferences.courseId === value.id}
                          onChange={() => handleCourseChange(key)}
                          style={{ display: "none" }}
                        />
                        {value.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group full">
                  <label>How Many Hours per Week? <span className="required">*</span></label>
                  <div className="option-row">
                    {[1, 2, 3, 4, 5, 6, 7].map((hour) => (
                      <div
                        key={hour}
                        className={`option ${preferences.hours === hour ? "active" : ""}`}
                        onClick={() => handleHoursChange(hour)}
                      >
                        <input
                          type="radio"
                          name="hours"
                          value={hour}
                          checked={preferences.hours === hour}
                          onChange={() => handleHoursChange(hour)}
                          style={{ display: "none" }}
                        />
                        {hour}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group full">
                  <label>Course Pricing Summary</label>
                  <div className="pricing-summary-container">
                    <div className="pricing-summary-header">
                      <span>Plan</span>
                      <span>Rate</span>
                      <span className="hide-mobile">Course</span>
                      <span className="hide-mobile">Hours</span>
                      <span>Total / Month</span>
                    </div>
                    {getPricingRows()}
                  </div>
                </div>

                <div className="form-group full">
                  <label>Which Days Work Best for You? <span className="required">*</span></label>
                  <div className="days-row">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className={`day-option ${preferences.days.includes(day) ? "active" : ""} ${isDayDisabled(day) ? "disabled" : ""}`}
                        onClick={() => !isDayDisabled(day) && handleDayToggle(day)}
                      >
                        <input
                          type="checkbox"
                          value={day}
                          checked={preferences.days.includes(day)}
                          onChange={() => {}}
                          style={{ display: "none" }}
                        />
                        {day}
                      </div>
                    ))}
                  </div>
                  <small>
                    Select up to {preferences.hours || 7} days ({preferences.days.length}/{preferences.hours || 7} selected)
                  </small>
                </div>

                <div className="form-group">
                  <label>Preferred Date <span className="required">*</span></label>
                  <div className="date-wrapper">
                    <input
                      type="date"
                      className="date-input-with-arrow"
                      min={tomorrowStr}
                      max={maxDate}
                      value={preferences.trialDate}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, trialDate: e.target.value }))}
                      required
                    />
                  </div>
                  {/*<small>📅 Available: {tomorrowStr} to {maxDate}</small>*/}
                </div>

                <div className="form-group">
                  <label>Preferred Time <span className="required">*</span></label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div className="select-wrapper" style={{ flex: 1 }}>
                      <select
                        value={preferences.preferredTime}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, preferredTime: e.target.value }))}
                        className="time-select"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                    <div className="select-wrapper" style={{ width: "80px" }}>
                      <select
                        value={ampm}
                        onChange={(e) => setAmpm(e.target.value)}
                        className="ampm-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>
                  {/*<small>⏰ Available in 30-minute slots</small>*/}
                </div>
              </div>

              <div className="button-group">
                <button type="button" className="btn prev-btn" onClick={prevStep}>
                  Previous
                </button>
                <button type="submit" className="btn submit-btn">
                  Complete Registration →
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}