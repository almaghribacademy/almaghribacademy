"use client";
import "../pages-css/trial-form.css";
import { useState, useEffect } from "react";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import Swal from "sweetalert2";


export default function TrialForm() {
  const today = new Date();
  
  // Get tomorrow's date (today + 1 day)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  
  // Calculate date 1 month from tomorrow
  const maxDateObj = new Date(tomorrow);
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  // Set default time to nearest 00 or 30 minutes in 12-hour format
  const getDefaultTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    let hours = now.getHours();
    let selectedMinutes = minutes >= 30 ? 30 : 0;
    
    // Convert to 12-hour format
    let hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    if (minutes >= 30) {
      selectedMinutes = 30;
    } else {
      selectedMinutes = 0;
    }
    
    return `${String(hour12).padStart(2, '0')}:${String(selectedMinutes).padStart(2, '0')}`;
  };

  const [countryCode, setCountryCode] = useState("+44");
  const [detectedCountry, setDetectedCountry] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ampm, setAmpm] = useState(() => {
    const now = new Date();
    return now.getHours() >= 12 ? 'PM' : 'AM';
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    preferredDate: tomorrowStr,
    preferredTime: getDefaultTime(),
  });

  // Detect user's country and set country code automatically
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Method 1: Using ipapi.co (free, no API key required)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code) {
          const countryName = data.country_name;
          const countryCode = data.country_calling_code;
          
          if (countryName) {
            setDetectedCountry(countryName);
            setFormData(prev => ({
              ...prev,
              country: countryName
            }));
          }
          
          if (countryCode) {
            setCountryCode(countryCode);
          }
        }
      } catch (error) {
        console.log('IP detection failed, trying fallback...');
        
        // Method 2: Fallback using ip-api.com
        try {
          const fallbackResponse = await fetch('http://ip-api.com/json/');
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.country) {
            setDetectedCountry(fallbackData.country);
            setFormData(prev => ({
              ...prev,
              country: fallbackData.country
            }));
          }
          
          // Map country to phone code
          const countryToCode: { [key: string]: string } = {
            "Afghanistan": "+93",
            "Albania": "+355",
            "Algeria": "+213",
            "Andorra": "+376",
            "Angola": "+244",
            "Argentina": "+54",
            "Armenia": "+374",
            "Australia": "+61",
            "Austria": "+43",
            "Azerbaijan": "+994",
            "Bahrain": "+973",
            "Bangladesh": "+880",
            "Belarus": "+375",
            "Belgium": "+32",
            "Bhutan": "+975",
            "Bolivia": "+591",
            "Bosnia and Herzegovina": "+387",
            "Brazil": "+55",
            "Brunei": "+673",
            "Bulgaria": "+359",
            "Burkina Faso": "+226",
            "Burundi": "+257",
            "Cambodia": "+855",
            "Cameroon": "+237",
            "Canada": "+1",
            "Cape Verde": "+238",
            "Central African Republic": "+236",
            "Chad": "+235",
            "Chile": "+56",
            "China": "+86",
            "Colombia": "+57",
            "Comoros": "+269",
            "Congo": "+242",
            "Costa Rica": "+506",
            "Croatia": "+385",
            "Cuba": "+53",
            "Cyprus": "+357",
            "Czech Republic": "+420",
            "Denmark": "+45",
            "Djibouti": "+253",
            "Dominica": "+1",
            "Dominican Republic": "+1",
            "Ecuador": "+593",
            "Egypt": "+20",
            "El Salvador": "+503",
            "Equatorial Guinea": "+240",
            "Eritrea": "+291",
            "Estonia": "+372",
            "Eswatini": "+268",
            "Ethiopia": "+251",
            "Fiji": "+679",
            "Finland": "+358",
            "France": "+33",
            "Gabon": "+241",
            "Gambia": "+220",
            "Georgia": "+995",
            "Germany": "+49",
            "Ghana": "+233",
            "Greece": "+30",
            "Grenada": "+1",
            "Guatemala": "+502",
            "Guinea": "+224",
            "Guinea-Bissau": "+245",
            "Guyana": "+592",
            "Haiti": "+509",
            "Honduras": "+504",
            "Hungary": "+36",
            "Iceland": "+354",
            "India": "+91",
            "Indonesia": "+62",
            "Iran": "+98",
            "Iraq": "+964",
            "Ireland": "+353",
            "Israel": "+972",
            "Italy": "+39",
            "Ivory Coast": "+225",
            "Jamaica": "+1",
            "Japan": "+81",
            "Jordan": "+962",
            "Kazakhstan": "+7",
            "Kenya": "+254",
            "Kiribati": "+686",
            "Kuwait": "+965",
            "Kyrgyzstan": "+996",
            "Laos": "+856",
            "Latvia": "+371",
            "Lebanon": "+961",
            "Lesotho": "+266",
            "Liberia": "+231",
            "Libya": "+218",
            "Liechtenstein": "+423",
            "Lithuania": "+370",
            "Luxembourg": "+352",
            "Madagascar": "+261",
            "Malawi": "+265",
            "Malaysia": "+60",
            "Maldives": "+960",
            "Mali": "+223",
            "Malta": "+356",
            "Marshall Islands": "+692",
            "Mauritania": "+222",
            "Mauritius": "+230",
            "Mexico": "+52",
            "Micronesia": "+691",
            "Moldova": "+373",
            "Monaco": "+377",
            "Mongolia": "+976",
            "Montenegro": "+382",
            "Morocco": "+212",
            "Mozambique": "+258",
            "Myanmar": "+95",
            "Namibia": "+264",
            "Nauru": "+674",
            "Nepal": "+977",
            "Netherlands": "+31",
            "New Zealand": "+64",
            "Nicaragua": "+505",
            "Niger": "+227",
            "Nigeria": "+234",
            "North Korea": "+850",
            "North Macedonia": "+389",
            "Norway": "+47",
            "Oman": "+968",
            "Pakistan": "+92",
            "Palau": "+680",
            "Palestine": "+970",
            "Panama": "+507",
            "Papua New Guinea": "+675",
            "Paraguay": "+595",
            "Peru": "+51",
            "Philippines": "+63",
            "Poland": "+48",
            "Portugal": "+351",
            "Qatar": "+974",
            "Romania": "+40",
            "Russia": "+7",
            "Rwanda": "+250",
            "Saint Kitts and Nevis": "+1",
            "Saint Lucia": "+1",
            "Saint Vincent": "+1",
            "Samoa": "+685",
            "San Marino": "+378",
            "Sao Tome and Principe": "+239",
            "Saudi Arabia": "+966",
            "Senegal": "+221",
            "Serbia": "+381",
            "Seychelles": "+248",
            "Sierra Leone": "+232",
            "Singapore": "+65",
            "Slovakia": "+421",
            "Slovenia": "+386",
            "Solomon Islands": "+677",
            "Somalia": "+252",
            "South Africa": "+27",
            "South Korea": "+82",
            "South Sudan": "+211",
            "Spain": "+34",
            "Sri Lanka": "+94",
            "Sudan": "+249",
            "Suriname": "+597",
            "Sweden": "+46",
            "Switzerland": "+41",
            "Syria": "+963",
            "Taiwan": "+886",
            "Tajikistan": "+992",
            "Tanzania": "+255",
            "Thailand": "+66",
            "Timor-Leste": "+670",
            "Togo": "+228",
            "Tonga": "+676",
            "Trinidad and Tobago": "+1",
            "Tunisia": "+216",
            "Turkey": "+90",
            "Turkmenistan": "+993",
            "Tuvalu": "+688",
            "Uganda": "+256",
            "Ukraine": "+380",
            "United Arab Emirates": "+971",
            "United Kingdom": "+44",
            "United States": "+1",
            "Uruguay": "+598",
            "Uzbekistan": "+998",
            "Vanuatu": "+678",
            "Vatican City": "+379",
            "Venezuela": "+58",
            "Vietnam": "+84",
            "Yemen": "+967",
            "Zambia": "+260",
            "Zimbabwe": "+263"
          };
          
          if (fallbackData.country && countryToCode[fallbackData.country]) {
            setCountryCode(countryToCode[fallbackData.country]);
          }
        } catch (fallbackError) {
          console.log('Fallback detection failed, using default');
        }
      }
    };

    detectCountry();
  }, []);

  // Validation function for Step 1
  const validateStep1 = () => {
    const { firstName, lastName, email, phone, country } = formData;
    const newErrors: { [key: string]: string } = {};

    // First Name Validation
    const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (!nameRegex.test(firstName.trim())) {
      newErrors.firstName = "Only letters, spaces, hyphens, or apostrophes (2-50 characters)";
    }

    // Last Name Validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (!nameRegex.test(lastName.trim())) {
      newErrors.lastName = "Only letters, spaces, hyphens, or apostrophes (2-50 characters)";
    }

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address (e.g., name@domain.com)";
    }

    // Phone Validation
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = "Only numbers (7-15 digits)";
    }

    // Country Validation
    if (!country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setErrors({});
  };

  const [selected, setSelected] = useState<{
    [key: string]: string;
  }>({});

  const handleSelect = (group: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [group]: value,
    }));
    // Clear error for this group if it exists
    if (errors[group]) {
      setErrors(prev => ({ ...prev, [group]: "" }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!selected.course) {
      newErrors.course = "Please select a course";
    }

    if (!selected.session) {
      newErrors.session = "Please select who the trial is for";
    }

    if (!selected.teacher) {
      newErrors.teacher = "Please select a preferred teacher";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please fill all required fields.",
      });
      return;
    }

    // START LOADER
    setLoading(true);

    try {
      const timeStr = formData.preferredTime;
      const [hours, minutes] = timeStr.split(":");

      let hour24 = parseInt(hours);

      if (ampm === "PM" && hour24 !== 12) hour24 += 12;
      if (ampm === "AM" && hour24 === 12) hour24 = 0;

      const time24 = `${String(hour24).padStart(2, "0")}:${minutes}`;

      const response = await fetch("/api/trial-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: `${countryCode}${formData.phone}`,
          course: selected.course,
          session: selected.session,
          teacher: selected.teacher,
          source: selected.source || "",
          detectedCountry,
          preferredTime: time24,
        }),
      });

      const data = await response.json();

      // STOP LOADER
      setLoading(false);

      if (response.ok) {
        Swal.fire({
          title: "Booking Submitted!",
          html: `
          <div style="text-align:center;">
            <img src="https://www.almaghrib.academy/assets/images/only-logo.png"
            alt="AlMaghrib Academy"
            style="max-width:60px;
            margin:0 auto 15px auto;
            display:block;" />

            <p style="
            color:#333;
            font-size:16px;
            line-height:1.8;
            margin:0;">
            Your trial booking has been submitted successfully!<br />
            <span style="
            color:#0a2e7a;
            font-weight:600;">
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

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          preferredDate: tomorrowStr,
          preferredTime: getDefaultTime(),
        });

        setSelected({});
        setErrors({});
        setStep(1);
        setCountryCode("+44");

        const now = new Date();
        setAmpm(now.getHours() >= 12 ? "PM" : "AM");
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            data.message ||
            "Failed to submit booking. Please try again.",
          confirmButtonColor: "#0a2e7a",
        }).then((result) => {
            window.location.reload();
        });
      }
    } catch (error) {
      // STOP LOADER
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#0a2e7a",
      }).then((result) => {
            window.location.reload();
        });
    }
  };

  // Map country to country code for auto-selection
  const countryToCodeMap: { [key: string]: string } = {
    "Afghanistan": "+93",
    "Albania": "+355",
    "Algeria": "+213",
    "Andorra": "+376",
    "Angola": "+244",
    "Argentina": "+54",
    "Armenia": "+374",
    "Australia": "+61",
    "Austria": "+43",
    "Azerbaijan": "+994",
    "Bahrain": "+973",
    "Bangladesh": "+880",
    "Belarus": "+375",
    "Belgium": "+32",
    "Bhutan": "+975",
    "Bolivia": "+591",
    "Bosnia and Herzegovina": "+387",
    "Brazil": "+55",
    "Brunei": "+673",
    "Bulgaria": "+359",
    "Burkina Faso": "+226",
    "Burundi": "+257",
    "Cambodia": "+855",
    "Cameroon": "+237",
    "Canada": "+1",
    "Cape Verde": "+238",
    "Central African Republic": "+236",
    "Chad": "+235",
    "Chile": "+56",
    "China": "+86",
    "Colombia": "+57",
    "Comoros": "+269",
    "Congo": "+242",
    "Costa Rica": "+506",
    "Croatia": "+385",
    "Cuba": "+53",
    "Cyprus": "+357",
    "Czech Republic": "+420",
    "Denmark": "+45",
    "Djibouti": "+253",
    "Dominica": "+1",
    "Dominican Republic": "+1",
    "Ecuador": "+593",
    "Egypt": "+20",
    "El Salvador": "+503",
    "Equatorial Guinea": "+240",
    "Eritrea": "+291",
    "Estonia": "+372",
    "Eswatini": "+268",
    "Ethiopia": "+251",
    "Fiji": "+679",
    "Finland": "+358",
    "France": "+33",
    "Gabon": "+241",
    "Gambia": "+220",
    "Georgia": "+995",
    "Germany": "+49",
    "Ghana": "+233",
    "Greece": "+30",
    "Grenada": "+1",
    "Guatemala": "+502",
    "Guinea": "+224",
    "Guinea-Bissau": "+245",
    "Guyana": "+592",
    "Haiti": "+509",
    "Honduras": "+504",
    "Hungary": "+36",
    "Iceland": "+354",
    "India": "+91",
    "Indonesia": "+62",
    "Iran": "+98",
    "Iraq": "+964",
    "Ireland": "+353",
    "Israel": "+972",
    "Italy": "+39",
    "Ivory Coast": "+225",
    "Jamaica": "+1",
    "Japan": "+81",
    "Jordan": "+962",
    "Kazakhstan": "+7",
    "Kenya": "+254",
    "Kiribati": "+686",
    "Kuwait": "+965",
    "Kyrgyzstan": "+996",
    "Laos": "+856",
    "Latvia": "+371",
    "Lebanon": "+961",
    "Lesotho": "+266",
    "Liberia": "+231",
    "Libya": "+218",
    "Liechtenstein": "+423",
    "Lithuania": "+370",
    "Luxembourg": "+352",
    "Madagascar": "+261",
    "Malawi": "+265",
    "Malaysia": "+60",
    "Maldives": "+960",
    "Mali": "+223",
    "Malta": "+356",
    "Marshall Islands": "+692",
    "Mauritania": "+222",
    "Mauritius": "+230",
    "Mexico": "+52",
    "Micronesia": "+691",
    "Moldova": "+373",
    "Monaco": "+377",
    "Mongolia": "+976",
    "Montenegro": "+382",
    "Morocco": "+212",
    "Mozambique": "+258",
    "Myanmar": "+95",
    "Namibia": "+264",
    "Nauru": "+674",
    "Nepal": "+977",
    "Netherlands": "+31",
    "New Zealand": "+64",
    "Nicaragua": "+505",
    "Niger": "+227",
    "Nigeria": "+234",
    "North Korea": "+850",
    "North Macedonia": "+389",
    "Norway": "+47",
    "Oman": "+968",
    "Pakistan": "+92",
    "Palau": "+680",
    "Palestine": "+970",
    "Panama": "+507",
    "Papua New Guinea": "+675",
    "Paraguay": "+595",
    "Peru": "+51",
    "Philippines": "+63",
    "Poland": "+48",
    "Portugal": "+351",
    "Qatar": "+974",
    "Romania": "+40",
    "Russia": "+7",
    "Rwanda": "+250",
    "Saint Kitts and Nevis": "+1",
    "Saint Lucia": "+1",
    "Saint Vincent": "+1",
    "Samoa": "+685",
    "San Marino": "+378",
    "Sao Tome and Principe": "+239",
    "Saudi Arabia": "+966",
    "Senegal": "+221",
    "Serbia": "+381",
    "Seychelles": "+248",
    "Sierra Leone": "+232",
    "Singapore": "+65",
    "Slovakia": "+421",
    "Slovenia": "+386",
    "Solomon Islands": "+677",
    "Somalia": "+252",
    "South Africa": "+27",
    "South Korea": "+82",
    "South Sudan": "+211",
    "Spain": "+34",
    "Sri Lanka": "+94",
    "Sudan": "+249",
    "Suriname": "+597",
    "Sweden": "+46",
    "Switzerland": "+41",
    "Syria": "+963",
    "Taiwan": "+886",
    "Tajikistan": "+992",
    "Tanzania": "+255",
    "Thailand": "+66",
    "Timor-Leste": "+670",
    "Togo": "+228",
    "Tonga": "+676",
    "Trinidad and Tobago": "+1",
    "Tunisia": "+216",
    "Turkey": "+90",
    "Turkmenistan": "+993",
    "Tuvalu": "+688",
    "Uganda": "+256",
    "Ukraine": "+380",
    "United Arab Emirates": "+971",
    "United Kingdom": "+44",
    "United States": "+1",
    "Uruguay": "+598",
    "Uzbekistan": "+998",
    "Vanuatu": "+678",
    "Vatican City": "+379",
    "Venezuela": "+58",
    "Vietnam": "+84",
    "Yemen": "+967",
    "Zambia": "+260",
    "Zimbabwe": "+263"
  };

  // Handle country change - auto-select country code
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    const code = countryToCodeMap[selectedCountry] || "";
    
    setFormData({
      ...formData,
      country: selectedCountry,
    });

    // Clear country error
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: "" }));
    }

    // Auto-select country code if found
    if (code) {
      setCountryCode(code);
    }
  };

  // List of countries with codes
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
    "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan",
    "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
    "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe"
  ];

  // Country codes for phone - only showing codes (no country names)
  const countryCodes = [
    { code: "+93" },
    { code: "+355" },
    { code: "+213" },
    { code: "+376" },
    { code: "+244" },
    { code: "+54" },
    { code: "+374" },
    { code: "+61" },
    { code: "+43" },
    { code: "+994" },
    { code: "+973" },
    { code: "+880" },
    { code: "+375" },
    { code: "+32" },
    { code: "+975" },
    { code: "+591" },
    { code: "+387" },
    { code: "+55" },
    { code: "+673" },
    { code: "+359" },
    { code: "+226" },
    { code: "+855" },
    { code: "+237" },
    { code: "+1" },
    { code: "+56" },
    { code: "+86" },
    { code: "+57" },
    { code: "+506" },
    { code: "+385" },
    { code: "+53" },
    { code: "+357" },
    { code: "+420" },
    { code: "+45" },
    { code: "+593" },
    { code: "+20" },
    { code: "+372" },
    { code: "+251" },
    { code: "+679" },
    { code: "+358" },
    { code: "+33" },
    { code: "+241" },
    { code: "+220" },
    { code: "+995" },
    { code: "+49" },
    { code: "+233" },
    { code: "+30" },
    { code: "+502" },
    { code: "+224" },
    { code: "+592" },
    { code: "+509" },
    { code: "+504" },
    { code: "+36" },
    { code: "+354" },
    { code: "+91" },
    { code: "+62" },
    { code: "+98" },
    { code: "+964" },
    { code: "+353" },
    { code: "+972" },
    { code: "+39" },
    { code: "+81" },
    { code: "+962" },
    { code: "+7" },
    { code: "+254" },
    { code: "+965" },
    { code: "+996" },
    { code: "+856" },
    { code: "+371" },
    { code: "+961" },
    { code: "+218" },
    { code: "+370" },
    { code: "+352" },
    { code: "+261" },
    { code: "+265" },
    { code: "+60" },
    { code: "+960" },
    { code: "+223" },
    { code: "+356" },
    { code: "+222" },
    { code: "+52" },
    { code: "+373" },
    { code: "+377" },
    { code: "+976" },
    { code: "+382" },
    { code: "+212" },
    { code: "+258" },
    { code: "+95" },
    { code: "+264" },
    { code: "+977" },
    { code: "+31" },
    { code: "+64" },
    { code: "+505" },
    { code: "+234" },
    { code: "+47" },
    { code: "+968" },
    { code: "+92" },
    { code: "+970" },
    { code: "+507" },
    { code: "+675" },
    { code: "+595" },
    { code: "+51" },
    { code: "+63" },
    { code: "+48" },
    { code: "+351" },
    { code: "+974" },
    { code: "+40" },
    { code: "+966" },
    { code: "+221" },
    { code: "+381" },
    { code: "+248" },
    { code: "+65" },
    { code: "+421" },
    { code: "+386" },
    { code: "+677" },
    { code: "+252" },
    { code: "+27" },
    { code: "+82" },
    { code: "+34" },
    { code: "+94" },
    { code: "+249" },
    { code: "+597" },
    { code: "+46" },
    { code: "+41" },
    { code: "+963" },
    { code: "+886" },
    { code: "+992" },
    { code: "+255" },
    { code: "+66" },
    { code: "+228" },
    { code: "+216" },
    { code: "+90" },
    { code: "+993" },
    { code: "+256" },
    { code: "+380" },
    { code: "+971" },
    { code: "+44" },
    { code: "+598" },
    { code: "+998" },
    { code: "+58" },
    { code: "+84" },
    { code: "+967" },
    { code: "+260" },
    { code: "+263" }
  ];

  // Remove duplicates from countryCodes
  const uniqueCountryCodes = countryCodes.filter(
    (code, index, self) => 
      index === self.findIndex((c) => c.code === code.code)
  );

  // Generate time options (00 and 30 minutes only) in 12-hour format
  const timeOptions = [];
  for (let hour = 0; hour < 12; hour++) {
    const hourStr = hour === 0 ? '12' : String(hour).padStart(2, '0');
    timeOptions.push(`${hourStr}:00`);
    timeOptions.push(`${hourStr}:30`);
  }

  return (
    <>
      <Header />
      {loading && (
        <div className="custom-loader-overlay">
          <div className="custom-loader">

            <img
              src="https://www.almaghrib.academy/assets/images/only-logo.png"
              alt="AlMaghrib Academy"
              className="loader-logo"
            />

            <h3>Submitting Your Booking...</h3>

            <p>Please wait a moment.</p>

            <div className="loader-spinner"></div>

          </div>
        </div>
      )}
      <div className="form-wrapper">
        {/* Progress */}
        <div className="progress-wrapper">
          <div className="progress-head">
            <span>Step 1 — Your Details</span>
            <span>Step 2 — Preferences</span>
          </div>
          <div className="progress">
            <div className={`circle ${step >= 1 ? "active" : ""}`} />
            <div className={`line ${step === 2 ? "active" : ""}`} />
            <div className={`circle ${step === 2 ? "active" : ""}`} />
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="step-title">Tell us about yourself</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  First Name <span className="required">*</span>
                </label>
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
                <label>
                  Last Name <span className="required">*</span>
                </label>
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

              <div className="form-group full">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  value={formData.email}
                  className={errors.email ? "error" : ""}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group full">
                <label>
                  Phone <span className="required">*</span>
                </label>
                <div className="phone-wrapper">
                  <div className="select-wrapper" style={{ width: "100px", flexShrink: 0 }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
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
                {detectedCountry && !errors.phone && (
                  <small style={{ color: "#10b981", marginTop: "4px", display: "block" }}>
                    
                  </small>
                )}
              </div>

              <div className="form-group full">
                <label>
                  Country <span className="required">*</span>
                </label>
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

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="step-title">Your Learning Preferences</h2>

            <div className="form-grid">
              <div className="form-group full">
                <label>
                  What would you like to learn? <span className="required">*</span>
                </label>
                <div className="option-row">
                  {["Quran", "Arabic Language", "Islamic Studies"].map((item) => (
                    <label
                      key={item}
                      className={`option ${selected.course === item ? "active" : ""} ${errors.course ? "error" : ""}`}
                      onClick={() => handleSelect("course", item)}
                    >
                      {item}
                    </label>
                  ))}
                </div>
                {errors.course && <span className="error-message">{errors.course}</span>}
              </div>

              <div className="form-group full">
                <label>
                  This trial session is for? <span className="required">*</span>
                </label>
                <div className="option-row">
                  {["Myself", "Family Member"].map((item) => (
                    <label
                      key={item}
                      className={`option ${selected.session === item ? "active" : ""} ${errors.session ? "error" : ""}`}
                      onClick={() => handleSelect("session", item)}
                    >
                      {item}
                    </label>
                  ))}
                </div>
                {errors.session && <span className="error-message">{errors.session}</span>}
              </div>

              <div className="form-group full">
                <label>
                  Your preferred teacher <span className="required">*</span>
                </label>
                <div className="option-row">
                  {["Male", "Female", "Either"].map((item) => (
                    <label
                      key={item}
                      className={`option ${selected.teacher === item ? "active" : ""} ${errors.teacher ? "error" : ""}`}
                      onClick={() => handleSelect("teacher", item)}
                    >
                      {item}
                    </label>
                  ))}
                </div>
                {errors.teacher && <span className="error-message">{errors.teacher}</span>}
              </div>

              <div className="form-group full">
                <label>How did you find us?</label>
                <div className="option-row">
                  {["Friends", "Social Media", "Email", "Google", "Others"].map((item) => (
                    <label
                      key={item}
                      className={`option ${selected.source === item ? "active" : ""}`}
                      onClick={() => handleSelect("source", item)}
                    >
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Date</label>
                <div className="date-wrapper">
                  <input
                    type="date"
                    placeholder="Choose a Date"
                    min={tomorrowStr}
                    max={maxDate}
                    value={formData.preferredDate}
                    className="date-input-with-arrow"
                    onChange={(e) =>
                      handleInputChange("preferredDate", e.target.value)
                    }
                  />
                </div>
                {/*<small style={{ color: "#64748b", marginTop: "4px", display: "block" }}>
                  📅 Available: {tomorrowStr} to {maxDate}
                </small>*/}
              </div>

              <div className="form-group">
                <label>Preferred Time</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div className="select-wrapper" style={{ flex: 1 }}>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange("preferredTime", e.target.value)}
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
                      onChange={(e) => {
                        setAmpm(e.target.value);
                      }}
                      className="ampm-select"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                {/*<small style={{ color: "#64748b", marginTop: "4px", display: "block" }}>
                  ⏰ Available in 30-minute slots
                </small>*/}
              </div>
            </div>

            <div className="button-group">
              <button className="btn prev-btn" onClick={prevStep}>
                Previous
              </button>

              <button
                type="button"
                className="btn submit-btn"
                onClick={handleSubmit}
              >
                Submit Booking →
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}