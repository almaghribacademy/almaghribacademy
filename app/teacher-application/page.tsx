import type { Metadata } from "next";
import TeacherRegistrationForm from "./TeacherRegistrationForm";

export const metadata: Metadata = {
  title: "Teacher Registration | AlMaghrib Academy",
  description:
    "Apply to become an online Quran teacher at AlMaghrib Academy and inspire students around the world.",
};

export default function Page() {
  return <TeacherRegistrationForm />;
}