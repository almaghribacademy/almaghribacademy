// src/data/teachers.ts

export interface Teacher {
  id: number;
  name: string;
  role: string;
  experience: string;
  image: string;
  specialty: string;
  education: string;
  bio: string;
  rating: number;
  students: number;
  courses: string[];
  availability: string;
  languages: string[];
  teachingStyle: string;
}

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Mufti Ahmed",
    role: "Quran & Tajweed Teacher",
    experience: "12+ Years Experience",
    image: "/assets/images/teacher-male-1.png",
    specialty: "Quran Recitation & Tajweed",
    education: "Master's in Islamic Studies",
    bio: "Mufti Ahmed has been teaching Quran and Tajweed for over 12 years. He is a certified Qari and has helped hundreds of students master Quran recitation.",
    rating: 4.9,
    students: 342,
    courses: ["Quran Recitation", "Tajweed Rules", "Quran Memorization"],
    availability: "Mon-Fri, 9AM - 8PM",
    languages: ["Arabic", "English", "Urdu"],
    teachingStyle: "Interactive, Patient, Structured",
  },
  {
    id: 2,
    name: "Ustadh Abdullah",
    role: "Arabic Language Teacher",
    experience: "10+ Years Experience",
    image: "/assets/images/teacher-male-2.png",
    specialty: "Arabic Grammar & Literature",
    education: "PhD in Arabic Literature",
    bio: "Ustadh Abdullah is a passionate Arabic teacher with a PhD in Arabic Literature. He makes learning Arabic fun and accessible for students of all levels.",
    rating: 4.8,
    students: 256,
    courses: ["Arabic Grammar", "Arabic Literature", "Conversational Arabic"],
    availability: "Mon-Sat, 8AM - 6PM",
    languages: ["Arabic", "English", "French"],
    teachingStyle: "Conversational, Engaging, Practical",
  },
  {
    id: 3,
    name: "Ustadh Ibrahim",
    role: "Islamic Studies Teacher",
    experience: "15+ Years Experience",
    image: "/assets/images/teacher-male-6.png",
    specialty: "Islamic Jurisprudence & History",
    education: "PhD in Islamic Studies",
    bio: "Ustadh Ibrahim has dedicated his life to Islamic education. He specializes in Fiqh and Islamic history with 15 years of teaching experience.",
    rating: 4.9,
    students: 198,
    courses: ["Fiqh", "Islamic History", "Hadith Studies"],
    availability: "Mon-Thu, 10AM - 7PM",
    languages: ["Arabic", "English", "Turkish"],
    teachingStyle: "In-depth, Analytical, Comprehensive",
  },
  {
    id: 4,
    name: "Qari Yusuf",
    role: "Hifz Specialist",
    experience: "14+ Years Experience",
    image: "/assets/images/teacher-male-7.png",
    specialty: "Quran Memorization",
    education: "Certified Hafiz & Qari",
    bio: "Qari Yusuf is a certified Hafiz with 14 years of experience in teaching Quran memorization. He has helped over 200 students complete their Hifz.",
    rating: 4.7,
    students: 178,
    courses: ["Hifz Program", "Tajweed for Hifz", "Revision Techniques"],
    availability: "Daily, 6AM - 10PM",
    languages: ["Arabic", "English", "Urdu"],
    teachingStyle: "Focused, Consistent, Supportive",
  },
  {
    id: 5,
    name: "Ustadha Maryam",
    role: "Kids Quran Teacher",
    experience: "8+ Years Experience",
    image: "/assets/images/teacher-female-2.png",
    specialty: "Children's Quran Education",
    education: "Bachelor's in Islamic Education",
    bio: "Ustadha Maryam specializes in teaching Quran to children. Her engaging methods make learning enjoyable for young students.",
    rating: 4.9,
    students: 289,
    courses: ["Kids Quran", "Islamic Studies for Children", "Arabic for Kids"],
    availability: "Mon-Fri, 3PM - 8PM",
    languages: ["Arabic", "English", "Malay"],
    teachingStyle: "Fun, Interactive, Encouraging",
  },
  {
    id: 6,
    name: "Ustadha Aisha",
    role: "Female Quran Teacher",
    experience: "11+ Years Experience",
    image: "/assets/images/teacher-female-1.png",
    specialty: "Women's Quran & Tajweed",
    education: "Master's in Quranic Studies",
    bio: "Ustadha Aisha provides dedicated Quran instruction for female students. She creates a comfortable learning environment for women to study Quran.",
    rating: 4.8,
    students: 215,
    courses: ["Women's Quran", "Tajweed for Women", "Tafseer"],
    availability: "Mon-Sat, 9AM - 9PM",
    languages: ["Arabic", "English", "Somali"],
    teachingStyle: "Supportive, Detailed, Woman-focused",
  },
];

export default teachers;