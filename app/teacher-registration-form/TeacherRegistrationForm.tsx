"use client";
import "../pages-css/teacher-registration-form.css";
import { useState, useRef, useEffect } from "react";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import Swal from "sweetalert2";

export default function TeacherRegistration() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string>("");
  const [detectedCountryCode, setDetectedCountryCode] = useState<string>("+44");
  const audioRef = useRef<HTMLAudioElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    countryCode: "+44",
    mobile: "",
    country: "",
    dateOfBirth: "",
    maritalStatus: "",
    nationality: "",
    occupation: "",
    aboutMe: "",
    facebookProfile: "",
    profileImage: null as File | null,
    education: "",
    yearsOfExperience: "",
    motherLanguage: "",
    otherLanguage: "",
    cv: null as File | null,
    audio: null as File | null,
  });

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Country codes for phone with country names
  // Country codes for phone with country names
const countryCodes = [
  { code: "+93", name: "Afghanistan" },
  { code: "+355", name: "Albania" },
  { code: "+213", name: "Algeria" },
  { code: "+376", name: "Andorra" },
  { code: "+244", name: "Angola" },
  { code: "+54", name: "Argentina" },
  { code: "+374", name: "Armenia" },
  { code: "+61", name: "Australia" },
  { code: "+43", name: "Austria" },
  { code: "+994", name: "Azerbaijan" },
  { code: "+973", name: "Bahrain" },
  { code: "+880", name: "Bangladesh" },
  { code: "+375", name: "Belarus" },
  { code: "+32", name: "Belgium" },
  { code: "+975", name: "Bhutan" },
  { code: "+591", name: "Bolivia" },
  { code: "+387", name: "Bosnia and Herzegovina" },
  { code: "+55", name: "Brazil" },
  { code: "+673", name: "Brunei" },
  { code: "+359", name: "Bulgaria" },
  { code: "+226", name: "Burkina Faso" },
  { code: "+855", name: "Cambodia" },
  { code: "+237", name: "Cameroon" },
  { code: "+1", name: "Canada" },
  { code: "+56", name: "Chile" },
  { code: "+86", name: "China" },
  { code: "+57", name: "Colombia" },
  { code: "+506", name: "Costa Rica" },
  { code: "+385", name: "Croatia" },
  { code: "+53", name: "Cuba" },
  { code: "+357", name: "Cyprus" },
  { code: "+420", name: "Czech Republic" },
  { code: "+45", name: "Denmark" },
  { code: "+593", name: "Ecuador" },
  { code: "+20", name: "Egypt" },
  { code: "+372", name: "Estonia" },
  { code: "+251", name: "Ethiopia" },
  { code: "+679", name: "Fiji" },
  { code: "+358", name: "Finland" },
  { code: "+33", name: "France" },
  { code: "+241", name: "Gabon" },
  { code: "+220", name: "Gambia" },
  { code: "+995", name: "Georgia" },
  { code: "+49", name: "Germany" },
  { code: "+233", name: "Ghana" },
  { code: "+30", name: "Greece" },
  { code: "+502", name: "Guatemala" },
  { code: "+224", name: "Guinea" },
  { code: "+592", name: "Guyana" },
  { code: "+509", name: "Haiti" },
  { code: "+504", name: "Honduras" },
  { code: "+36", name: "Hungary" },
  { code: "+354", name: "Iceland" },
  { code: "+91", name: "India" },
  { code: "+62", name: "Indonesia" },
  { code: "+98", name: "Iran" },
  { code: "+964", name: "Iraq" },
  { code: "+353", name: "Ireland" },
  { code: "+972", name: "Israel" },
  { code: "+39", name: "Italy" },
  { code: "+81", name: "Japan" },
  { code: "+962", name: "Jordan" },
  { code: "+7", name: "Kazakhstan" },
  { code: "+254", name: "Kenya" },
  { code: "+965", name: "Kuwait" },
  { code: "+996", name: "Kyrgyzstan" },
  { code: "+856", name: "Laos" },
  { code: "+371", name: "Latvia" },
  { code: "+961", name: "Lebanon" },
  { code: "+218", name: "Libya" },
  { code: "+370", name: "Lithuania" },
  { code: "+352", name: "Luxembourg" },
  { code: "+261", name: "Madagascar" },
  { code: "+265", name: "Malawi" },
  { code: "+60", name: "Malaysia" },
  { code: "+960", name: "Maldives" },
  { code: "+223", name: "Mali" },
  { code: "+356", name: "Malta" },
  { code: "+222", name: "Mauritania" },
  { code: "+52", name: "Mexico" },
  { code: "+373", name: "Moldova" },
  { code: "+377", name: "Monaco" },
  { code: "+976", name: "Mongolia" },
  { code: "+382", name: "Montenegro" },
  { code: "+212", name: "Morocco" },
  { code: "+258", name: "Mozambique" },
  { code: "+95", name: "Myanmar" },
  { code: "+264", name: "Namibia" },
  { code: "+977", name: "Nepal" },
  { code: "+31", name: "Netherlands" },
  { code: "+64", name: "New Zealand" },
  { code: "+505", name: "Nicaragua" },
  { code: "+234", name: "Nigeria" },
  { code: "+47", name: "Norway" },
  { code: "+968", name: "Oman" },
  { code: "+92", name: "Pakistan" },
  { code: "+970", name: "Palestine" },
  { code: "+507", name: "Panama" },
  { code: "+675", name: "Papua New Guinea" },
  { code: "+595", name: "Paraguay" },
  { code: "+51", name: "Peru" },
  { code: "+63", name: "Philippines" },
  { code: "+48", name: "Poland" },
  { code: "+351", name: "Portugal" },
  { code: "+974", name: "Qatar" },
  { code: "+40", name: "Romania" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+221", name: "Senegal" },
  { code: "+381", name: "Serbia" },
  { code: "+248", name: "Seychelles" },
  { code: "+65", name: "Singapore" },
  { code: "+421", name: "Slovakia" },
  { code: "+386", name: "Slovenia" },
  { code: "+677", name: "Solomon Islands" },
  { code: "+252", name: "Somalia" },
  { code: "+27", name: "South Africa" },
  { code: "+82", name: "South Korea" },
  { code: "+34", name: "Spain" },
  { code: "+94", name: "Sri Lanka" },
  { code: "+249", name: "Sudan" },
  { code: "+597", name: "Suriname" },
  { code: "+46", name: "Sweden" },
  { code: "+41", name: "Switzerland" },
  { code: "+963", name: "Syria" },
  { code: "+886", name: "Taiwan" },
  { code: "+992", name: "Tajikistan" },
  { code: "+255", name: "Tanzania" },
  { code: "+66", name: "Thailand" },
  { code: "+228", name: "Togo" },
  { code: "+216", name: "Tunisia" },
  { code: "+90", name: "Turkey" },
  { code: "+993", name: "Turkmenistan" },
  { code: "+256", name: "Uganda" },
  { code: "+380", name: "Ukraine" },
  { code: "+971", name: "United Arab Emirates" },
  { code: "+44", name: "United Kingdom" },
  { code: "+1", name: "United States" },
  { code: "+598", name: "Uruguay" },
  { code: "+998", name: "Uzbekistan" },
  { code: "+58", name: "Venezuela" },
  { code: "+84", name: "Vietnam" },
  { code: "+967", name: "Yemen" },
  { code: "+260", name: "Zambia" },
  { code: "+263", name: "Zimbabwe" }
];

  // Map country names to country codes for auto-detection
  const countryToCodeMap: { [key: string]: string } = {
    "United Kingdom": "+44",
    "United States": "+1",
    "India": "+91",
    "Australia": "+61",
    "Canada": "+1",
    "Pakistan": "+92",
    "Bangladesh": "+880",
    "UAE": "+971",
    "Saudi Arabia": "+966",
    "Egypt": "+20",
    "Morocco": "+212",
    "Nigeria": "+234",
    "South Africa": "+27",
    "New Zealand": "+64",
    "Singapore": "+65",
    "Malaysia": "+60",
    "Indonesia": "+62",
    "Sri Lanka": "+94",
    "Nepal": "+977",
    "China": "+86",
    "Germany": "+49",
    "France": "+33",
    "Italy": "+39",
    "Spain": "+34",
    "Portugal": "+351",
    "Netherlands": "+31",
    "Belgium": "+32",
    "Switzerland": "+41",
    "Sweden": "+46",
    "Norway": "+47",
    "Denmark": "+45",
    "Finland": "+358",
    "Ireland": "+353",
    "Austria": "+43",
    "Greece": "+30",
    "Turkey": "+90",
    "Russia": "+7",
    "Ukraine": "+380",
    "Poland": "+48",
    "Romania": "+40",
    "Israel": "+972",
    "Iran": "+98",
    "Iraq": "+964",
    "Syria": "+963",
    "Jordan": "+962",
    "Lebanon": "+961",
    "Kuwait": "+965",
    "Qatar": "+974",
    "Bahrain": "+973",
    "Oman": "+968",
    "Yemen": "+967",
    "Afghanistan": "+93",
    "Albania": "+355",
    "Algeria": "+213",
    "Andorra": "+376",
    "Angola": "+244",
    "Argentina": "+54",
    "Armenia": "+374",
    "Azerbaijan": "+994",
    "Belarus": "+375",
    "Bolivia": "+591",
    "Bosnia": "+387",
    "Botswana": "+267",
    "Brazil": "+55",
    "Brunei": "+673",
    "Bulgaria": "+359",
    "Burundi": "+257",
    "Cambodia": "+855",
    "Cameroon": "+237",
    "Chile": "+56",
    "Colombia": "+57",
    "Costa Rica": "+506",
    "Croatia": "+385",
    "Cuba": "+53",
    "Cyprus": "+357",
    "Czech Republic": "+420",
    "Ecuador": "+593",
    "El Salvador": "+503",
    "Eritrea": "+291",
    "Estonia": "+372",
    "Eswatini": "+268",
    "Ethiopia": "+251",
    "Fiji": "+679",
    "Gambia": "+220",
    "Georgia": "+995",
    "Ghana": "+233",
    "Guatemala": "+502",
    "Guinea": "+224",
    "Honduras": "+504",
    "Hungary": "+36",
    "Iceland": "+354",
    "Jamaica": "+1876",
    "Japan": "+81",
    "Kazakhstan": "+7",
    "Kenya": "+254",
    "Kyrgyzstan": "+996",
    "Laos": "+856",
    "Latvia": "+371",
    "Lesotho": "+266",
    "Liberia": "+231",
    "Libya": "+218",
    "Liechtenstein": "+423",
    "Lithuania": "+370",
    "Luxembourg": "+352",
    "Madagascar": "+261",
    "Malawi": "+265",
    "Maldives": "+960",
    "Mali": "+223",
    "Malta": "+356",
    "Mauritania": "+222",
    "Mauritius": "+230",
    "Mexico": "+52",
    "Moldova": "+373",
    "Monaco": "+377",
    "Mongolia": "+976",
    "Montenegro": "+382",
    "Mozambique": "+258",
    "Myanmar": "+95",
    "Namibia": "+264",
    "Nicaragua": "+505",
    "Niger": "+227",
    "North Korea": "+850",
    "North Macedonia": "+389",
    "Palestine": "+970",
    "Panama": "+507",
    "Papua New Guinea": "+675",
    "Paraguay": "+595",
    "Peru": "+51",
    "Philippines": "+63",
    "Puerto Rico": "+1939",
    "Rwanda": "+250",
    "Samoa": "+685",
    "San Marino": "+378",
    "Senegal": "+221",
    "Serbia": "+381",
    "Sierra Leone": "+232",
    "Slovakia": "+421",
    "Slovenia": "+386",
    "Solomon Islands": "+677",
    "Somalia": "+252",
    "South Korea": "+82",
    "South Sudan": "+211",
    "Sudan": "+249",
    "Suriname": "+597",
    "Tajikistan": "+992",
    "Tanzania": "+255",
    "Thailand": "+66",
    "Togo": "+228",
    "Tonga": "+676",
    "Trinidad": "+1868",
    "Tunisia": "+216",
    "Turkmenistan": "+993",
    "Uganda": "+256",
    "Uruguay": "+598",
    "Uzbekistan": "+998",
    "Vatican": "+379",
    "Venezuela": "+58",
    "Vietnam": "+84",
    "Zambia": "+260",
    "Zimbabwe": "+263",
  };

  // Auto-detect user's country and set form fields
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Method 1: Using IP API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_name && data.country) {
          const countryName = data.country_name;
          const countryCode = data.country_code;
          
          // Set detected country
          setDetectedCountry(countryName);
          
          // Find matching country code from our list
          let matchedCode = countryToCodeMap[countryName];
          
          // If not found in map, try to find by country code
          if (!matchedCode) {
            const codeEntry = countryCodes.find(c => c.name === countryName);
            if (codeEntry) {
              matchedCode = codeEntry.code;
            }
          }
          
          // If still not found, check by country code (for US/Canada with +1)
          if (!matchedCode) {
            const codeEntry = countryCodes.find(c => 
              c.name.toLowerCase() === countryName.toLowerCase()
            );
            if (codeEntry) {
              matchedCode = codeEntry.code;
            }
          }
          
          // Set the detected country code if found
          if (matchedCode) {
            setDetectedCountryCode(matchedCode);
            setFormData(prev => ({
              ...prev,
              countryCode: matchedCode,
              country: countryName,
              nationality: countryName
            }));
          } else {
            // If no matching code found, still set the country
            setFormData(prev => ({
              ...prev,
              country: countryName,
              nationality: countryName
            }));
          }
        }
      } catch (error) {
        console.log("Could not detect country automatically");
        
        // Fallback: Use browser's timezone to guess country
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          // Simple fallback - you can expand this
          const timezoneToCountry: { [key: string]: string } = {
            'America/New_York': 'United States',
            'America/Los_Angeles': 'United States',
            'America/Chicago': 'United States',
            'America/Toronto': 'Canada',
            'Europe/London': 'United Kingdom',
            'Europe/Paris': 'France',
            'Europe/Berlin': 'Germany',
            'Asia/Dubai': 'UAE',
            'Asia/Kolkata': 'India',
            'Asia/Karachi': 'Pakistan',
            'Asia/Dhaka': 'Bangladesh',
            'Australia/Sydney': 'Australia',
            'Asia/Tokyo': 'Japan',
            'Asia/Shanghai': 'China',
          };
          
          const guessedCountry = timezoneToCountry[timezone];
          if (guessedCountry) {
            setDetectedCountry(guessedCountry);
            const code = countryToCodeMap[guessedCountry];
            if (code) {
              setDetectedCountryCode(code);
              setFormData(prev => ({
                ...prev,
                countryCode: code,
                country: guessedCountry,
                nationality: guessedCountry
              }));
            }
          }
        } catch (err) {
          console.log("Could not detect from timezone either");
        }
      }
    };

    detectCountry();
  }, []);

  const validateField = (name: string, value: any): string => {
    // ... (keep your existing validateField function)
    switch (name) {
      case "firstName":
        if (!value || !value.trim()) return "First name is required";
        if (!/^[A-Za-z\s'-]{2,50}$/.test(value.trim())) {
          return "First name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)";
        }
        return "";

      case "lastName":
        if (!value || !value.trim()) return "Last name is required";
        if (!/^[A-Za-z\s'-]{2,50}$/.test(value.trim())) {
          return "Last name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)";
        }
        return "";

      case "gender":
        if (!value) return "Gender is required";
        return "";

      case "email":
        if (!value || !value.trim()) return "Email is required";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) {
          return "Please enter a valid email address";
        }
        return "";

      case "mobile":
        if (!value || !value.trim()) return "Mobile number is required";
        if (!/^[0-9]{7,15}$/.test(value.trim())) {
          return "Mobile number must contain 7 to 15 digits";
        }
        return "";

      case "country":
        if (!value) return "Country is required";
        return "";

      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        return "";

      case "maritalStatus":
        if (!value) return "Marital status is required";
        return "";

      case "nationality":
        if (!value) return "Nationality is required";
        return "";

      case "occupation":
        if (!value || !value.trim()) return "Occupation is required";
        if (value.trim().length < 2) return "Occupation must be at least 2 characters";
        return "";

      case "aboutMe":
        if (!value || !value.trim()) return "About Me is required";
        if (value.trim().length < 20) return "Please provide at least 20 characters about yourself";
        if (value.trim().length > 1000) return "About Me cannot exceed 1000 characters";
        return "";

      case "facebookProfile":
        if (!value || !value.trim()) return "Facebook profile link is required";
        if (!/^https?:\/\/(www\.)?facebook\.com\/.+/i.test(value.trim())) {
          return "Please enter a valid Facebook profile URL";
        }
        return "";

      case "profileImage":
        if (!value) return "Profile image is required";
        const imgFile = value as File;
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validImageTypes.includes(imgFile.type)) return "Please upload a JPG or PNG image";
        if (imgFile.size > 2 * 1024 * 1024) return "Image size must be less than 2MB";
        return "";

      case "education":
        if (!value) return "Education is required";
        return "";

      case "yearsOfExperience":
        if (!value) return "Years of experience is required";
        return "";

      case "motherLanguage":
        if (!value) return "Mother language is required";
        return "";

      case "otherLanguage":
        if (!value) return "Other language is required";
        return "";

      case "cv":
        if (!value) return "CV is required";
        const cvFile = value as File;
        const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!validTypes.includes(cvFile.type)) return "Please upload a PDF, DOC, or DOCX file";
        if (cvFile.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
        return "";

      case "audio":
        if (!value) return "Audio sample is required";
        const audioFile = value as File;
        const validAudioTypes = ["audio/mpeg", "audio/mp3", "audio/wav"];
        if (!validAudioTypes.includes(audioFile.type) && !audioFile.name.match(/\.(mp3|wav)$/i)) {
          return "Please upload an audio file (MP3 or WAV)";
        }
        if (audioFile.size > 10 * 1024 * 1024) return "Audio file must be less than 10MB";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    // ... (keep your existing validateForm function)
    const newErrors: { [key: string]: string } = {};
    const fieldsToValidate = [
      "firstName", "lastName", "gender", "email", "mobile", "country",
      "dateOfBirth", "maritalStatus", "nationality", "occupation",
      "aboutMe", "facebookProfile", "profileImage", "education",
      "yearsOfExperience", "motherLanguage", "otherLanguage", "cv", "audio"
    ];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let sanitizedValue = value;
    if (name === "firstName" || name === "lastName") {
      sanitizedValue = value.replace(/[^A-Za-z\s'-]/g, "");
    } else if (name === "mobile") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData({ ...formData, [name]: sanitizedValue });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (keep your existing handleFileChange function)
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    
    setFormData({ ...formData, [name]: file });
    
    if (name === "profileImage" && file) {
      const url = URL.createObjectURL(file);
      setProfileImageUrl(url);
    }
    if (name === "audio" && file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRemoveFile = (name: string) => {
    // ... (keep your existing handleRemoveFile function)
    setFormData({ ...formData, [name]: null });
    if (name === "profileImage") {
      setProfileImageUrl(null);
    }
    if (name === "audio") {
      setAudioUrl(null);
      if (audioRef.current) {
        audioRef.current.src = "";
      }
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const formatFileSize = (bytes: number): string => {
    // ... (keep your existing formatFileSize function)
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    // ... (keep your existing handleSubmit function)
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        (element as HTMLElement).focus();
      }
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === "profileImage" || key === "cv" || key === "audio") {
          if (formData[key as keyof typeof formData]) {
            formDataToSend.append(key, formData[key as keyof typeof formData] as File);
          }
        } else if (key === "countryCode") {
          formDataToSend.append(key, formData[key as keyof typeof formData] as string);
        } else {
          formDataToSend.append(key, formData[key as keyof typeof formData] as string || "");
        }
      });

      const response = await fetch("/api/teacher-registration", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        Swal.fire({
          title: "Booking Submitted!",
          html: `
          <div style="text-align:center;">
            <img src="https://www.AlMaghribacademy.co/assets/images/only-logo.png"
            alt="AlMaghrib Academy"
            style="max-width:60px;
            margin:0 auto 15px auto;
            display:block;" />

            <p style="
            color:#333;
            font-size:16px;
            line-height:1.8;
            margin:0;">
            Your Application has been submitted successfully!<br />
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
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.message || "Failed to submit application. Please try again.",
          confirmButtonColor: "#0a2e7a",
        }).then((result) => {
            window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#0a2e7a",
      }).then((result) => {
            window.location.reload();
        });
      
    } finally {
      setLoading(false);
    }
  };

  // Dropdown options
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

  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed", "Separated"];

  const languages = [
    "Arabic", "English", "Urdu", "Hindi", "Bengali", "Spanish", "French",
    "German", "Turkish", "Persian", "Malay", "Indonesian", "Somali", "Amharic",
    "Swahili", "Hausa", "Yoruba", "Igbo", "Zulu", "Dutch", "Italian",
    "Portuguese", "Russian", "Japanese", "Chinese", "Korean", "Vietnamese"
  ];

  const educationOptions = [
    "High School", "Bachelor's Degree", "Master's Degree", "PhD",
    "Islamic Studies Certificate", "Quran Memorization (Hafiz)",
    "Diploma", "Other"
  ];

  const experienceOptions = ["0-1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

  return (
    <>
      {/* Custom Loader */}
      {loading && (
          <div className="custom-loader-overlay">
              <div className="custom-loader">
                  <img
                      src="/assets/images/only-logo.png"
                      alt="AlMaghrib Academy"
                      className="loader-logo"
                  />
                  <h3>Submitting Your Application</h3>
                  <p>
                      Please wait while we review and process
                      your teacher application.
                  </p>
                  <div className="loader-spinner"></div>
              </div>
          </div>
      )}
      <Header />
      <section className="teacher-registration">
        <div className="container">
          <div className="hero-section">
            <div className="hero-tag">📚 Join Our Team</div>
            <h1>Become a <span>Teacher</span> at AlMaghrib Academy</h1>
            <p style={{ fontSize: "18px", color: "#555", maxWidth: "600px", margin: "20px auto" }}>
              Share your knowledge and make a difference in students' lives around the world
            </p>
            <div className="hero-features">
              <div className="feature">🌍 Teach from Anywhere</div>
              <div className="feature">💼 Flexible Hours</div>
              <div className="feature">📈 Professional Growth</div>
            </div>
          </div>

          <div className="application-card">
            {submitted ? (
              <div className="success-message">
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
                <h3>Application Submitted Successfully!</h3>
                <p>
                  Thank you for applying to join AlMaghrib Academy as a teacher.
                  We have received your application and will review it carefully.
                  Our team will contact you within 2-3 business days.
                </p>
                <button
                  className="success-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      firstName: "", lastName: "", gender: "", email: "",
                      countryCode: "+44", mobile: "", country: "", dateOfBirth: "",
                      maritalStatus: "", nationality: "", occupation: "", aboutMe: "",
                      facebookProfile: "", profileImage: null, education: "",
                      yearsOfExperience: "", motherLanguage: "", otherLanguage: "",
                      cv: null, audio: null,
                    });
                    setProfileImageUrl(null);
                    setAudioUrl(null);
                    setErrors({});
                  }}
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <div className="stepper">
                  <div className="step active">
                    <div className="step-circle">1</div>
                    <span>Personal Info</span>
                  </div>
                  <div className="step active">
                    <div className="step-circle">2</div>
                    <span>Qualifications</span>
                  </div>
                  <div className="step active">
                    <div className="step-circle">3</div>
                    <span>Application</span>
                  </div>
                </div>

                <h2 style={{ fontSize: "28px", color: "#0a2e7a", marginBottom: "10px" }}>
                  Teacher Registration Form
                </h2>
                <p style={{ color: "#888", marginBottom: "30px" }}>
                  All fields marked with <span className="required">*</span> are required
                </p>

                {/* Show detected country info */}
                {/*{detectedCountry && (
                  <div style={{ 
                    backgroundColor: "#e8f4f8", 
                    padding: "15px 20px", 
                    borderRadius: "8px",
                    marginBottom: "25px",
                    border: "1px solid #b8d4e3",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <span style={{ fontSize: "20px" }}>📍</span>
                    <div>
                      <strong style={{ color: "#0a2e7a" }}>
                        Detected Location: {detectedCountry}
                      </strong>
                      <span style={{ marginLeft: "10px", color: "#555" }}>
                        (Country Code: {detectedCountryCode})
                      </span>
                      <span style={{ 
                        marginLeft: "10px", 
                        fontSize: "13px", 
                        color: "#666",
                        backgroundColor: "#d4eaf7",
                        padding: "2px 10px",
                        borderRadius: "12px"
                      }}>
                        ✓ Auto-detected
                      </span>
                    </div>
                  </div>
                )}*/}

                <div className="grid">
                  {/* Personal Information */}
                  <div className="form-group">
                    <label>First Name <span className="required">*</span></label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "error" : ""}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Last Name <span className="required">*</span></label>
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "error" : ""}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Gender <span className="required">*</span></label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={errors.gender ? "error" : ""}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-message">{errors.gender}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Mobile Number <span className="required">*</span></label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        style={{ width: "120px", flexShrink: 0 }}
                      >
                        {countryCodes.map((c) => (
                          // <option key={c.code} value={c.code}>
                          //   {c.code} {detectedCountryCode === c.code}
                          // </option>
                          <option key={`${c.code}-${c.name}`} value={c.code}>
                            {c.code} {detectedCountryCode === c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        name="mobile"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={errors.mobile ? "error" : ""}
                        style={{ flex: 1 }}
                      />
                    </div>
                    {detectedCountryCode && (
                      <small style={{ color: "#0a2e7a", display: "block", marginTop: "4px" }}>
                        
                      </small>
                    )}
                    {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                  </div>

                  <div className="form-group">
                    <label>Country <span className="required">*</span></label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={errors.country ? "error" : ""}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c} {detectedCountry === c}
                        </option>
                      ))}
                    </select>
                    {detectedCountry && (
                      <small style={{ color: "#0a2e7a", display: "block", marginTop: "4px" }}>
                        
                      </small>
                    )}
                    {errors.country && <span className="error-message">{errors.country}</span>}
                  </div>

                  <div className="form-group">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={errors.dateOfBirth ? "error" : ""}
                    />
                    {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                  </div>

                  <div className="form-group">
                    <label>Marital Status <span className="required">*</span></label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className={errors.maritalStatus ? "error" : ""}
                    >
                      <option value="">Select Marital Status</option>
                      {maritalStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.maritalStatus && <span className="error-message">{errors.maritalStatus}</span>}
                  </div>

                  <div className="form-group">
                    <label>Nationality <span className="required">*</span></label>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className={errors.nationality ? "error" : ""}
                    >
                      <option value="">Select Nationality</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c} {detectedCountry === c}
                        </option>
                      ))}
                    </select>
                    {detectedCountry && (
                      <small style={{ color: "#0a2e7a", display: "block", marginTop: "4px" }}>
                        
                      </small>
                    )}
                    {errors.nationality && <span className="error-message">{errors.nationality}</span>}
                  </div>

                  <div className="form-group">
                    <label>Occupation <span className="required">*</span></label>
                    <input
                      name="occupation"
                      type="text"
                      placeholder="Enter your occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className={errors.occupation ? "error" : ""}
                    />
                    {errors.occupation && <span className="error-message">{errors.occupation}</span>}
                  </div>

                  <div className="form-group full">
                    <label>About Me <span className="required">*</span></label>
                    <textarea
                      name="aboutMe"
                      placeholder="Tell us about yourself, your teaching experience, and why you want to join AlMaghrib Academy"
                      value={formData.aboutMe}
                      onChange={handleChange}
                      className={errors.aboutMe ? "error" : ""}
                      rows={5}
                    />
                    {errors.aboutMe && <span className="error-message">{errors.aboutMe}</span>}
                    <small>{formData.aboutMe.length}/1000 characters</small>
                  </div>

                  <div className="form-group full">
                    <label>Facebook Profile Link <span className="required">*</span></label>
                    <input
                      name="facebookProfile"
                      type="url"
                      placeholder="https://www.facebook.com/yourprofile"
                      value={formData.facebookProfile}
                      onChange={handleChange}
                      className={errors.facebookProfile ? "error" : ""}
                    />
                    {errors.facebookProfile && <span className="error-message">{errors.facebookProfile}</span>}
                  </div>

                  <div className="form-group full">
                    <label>Profile Image <span className="required">*</span></label>
                    <div className="file-upload-wrapper">
                      <input
                        name="profileImage"
                        type="file"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={handleFileChange}
                        className={errors.profileImage ? "error" : ""}
                      />
                      <div className="file-upload-area image-upload-area">
                        <div className="upload-icon">🖼️</div>
                        <p className="upload-text">
                          <span className="upload-highlight">Click to upload</span> or drag and drop
                        </p>
                        <p className="upload-hint">JPG, PNG (Max 2MB)</p>
                      </div>
                    </div>
                    {profileImageUrl && formData.profileImage && (
                      <div className="image-preview">
                        <img src={profileImageUrl} alt="Profile" className="profile-preview-img" />
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => handleRemoveFile("profileImage")}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {errors.profileImage && <span className="error-message">{errors.profileImage}</span>}
                  </div>

                  <div className="form-group">
                    <label>Education <span className="required">*</span></label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className={errors.education ? "error" : ""}
                    >
                      <option value="">Select Education</option>
                      {educationOptions.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                    {errors.education && <span className="error-message">{errors.education}</span>}
                  </div>

                  <div className="form-group">
                    <label>Years of Experience <span className="required">*</span></label>
                    <select
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className={errors.yearsOfExperience ? "error" : ""}
                    >
                      <option value="">Select Experience</option>
                      {experienceOptions.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                    {errors.yearsOfExperience && <span className="error-message">{errors.yearsOfExperience}</span>}
                  </div>

                  <div className="form-group">
                    <label>Mother Language <span className="required">*</span></label>
                    <select
                      name="motherLanguage"
                      value={formData.motherLanguage}
                      onChange={handleChange}
                      className={errors.motherLanguage ? "error" : ""}
                    >
                      <option value="">Select Mother Language</option>
                      {languages.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    {errors.motherLanguage && <span className="error-message">{errors.motherLanguage}</span>}
                  </div>

                  <div className="form-group">
                    <label>Other Language <span className="required">*</span></label>
                    <select
                      name="otherLanguage"
                      value={formData.otherLanguage}
                      onChange={handleChange}
                      className={errors.otherLanguage ? "error" : ""}
                    >
                      <option value="">Select Other Language</option>
                      {languages.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    {errors.otherLanguage && <span className="error-message">{errors.otherLanguage}</span>}
                  </div>

                  <div className="form-group full">
                    <label>Upload CV <span className="required">*</span></label>
                    <div className="file-upload-wrapper">
                      <input
                        name="cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className={errors.cv ? "error" : ""}
                      />
                      <div className="file-upload-area cv-upload-area">
                        <div className="upload-icon">📄</div>
                        <p className="upload-text">
                          <span className="upload-highlight">Click to upload</span> or drag and drop
                        </p>
                        <p className="upload-hint">PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                    </div>
                    {formData.cv && (
                      <div className="file-preview cv-preview">
                        <div className="file-info">
                          <span className="file-icon">📄</span>
                          <div className="file-details">
                            <strong>{formData.cv.name}</strong>
                            <span>{formatFileSize(formData.cv.size)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => handleRemoveFile("cv")}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {errors.cv && <span className="error-message">{errors.cv}</span>}
                  </div>

                  <div className="form-group full">
                    <label>Upload Audio Sample <span className="required">*</span></label>
                    <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                      Please recite the first 10 Ayah of Surah An-Naba and upload audio file.
                    </p>
                    <div className="file-upload-wrapper">
                      <input
                        name="audio"
                        type="file"
                        accept=".mp3,.wav,audio/mpeg,audio/wav"
                        onChange={handleFileChange}
                        className={errors.audio ? "error" : ""}
                      />
                      <div className="file-upload-area audio-upload-area">
                        <div className="upload-icon">🎵</div>
                        <p className="upload-text">
                          <span className="upload-highlight">Click to upload</span> or drag and drop
                        </p>
                        <p className="upload-hint">MP3, WAV (Max 10MB)</p>
                      </div>
                    </div>
                    {audioUrl && formData.audio && (
                      <div className="audio-preview">
                        <div className="audio-info">
                          <span className="audio-file-icon">🎵</span>
                          <div className="audio-details">
                            <strong>{formData.audio.name}</strong>
                            <span>{formatFileSize(formData.audio.size)}</span>
                          </div>
                        </div>
                        <audio ref={audioRef} controls className="audio-player">
                          <source src={audioUrl} type={formData.audio.type || "audio/mpeg"} />
                          Your browser does not support the audio element.
                        </audio>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => handleRemoveFile("audio")}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {errors.audio && <span className="error-message">{errors.audio}</span>}
                    <small style={{ color: "#888", display: "block", marginTop: "5px" }}>
                      Please recite the first 10 Ayah of Surah An-Naba (Chapter 78, verses 1-10)
                    </small>
                  </div>

                  <div className="btn-area">
                    <button
                      type="button"
                      className="btn submit-btn"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}