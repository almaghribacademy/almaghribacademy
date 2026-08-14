import type { Metadata } from "next";
import TrialForm from "./TrialForm";

export const metadata: Metadata = {
  title: "Book a Free Trial Class | AlMaghrib Academy",
  description:
    "Schedule your free online Quran trial class and experience personalized learning with expert teachers.",
};

export default function Page() {
  return <TrialForm />;
}