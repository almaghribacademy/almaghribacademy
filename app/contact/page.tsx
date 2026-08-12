import type { Metadata } from "next";
import Contact from "./Contact";

export const metadata: Metadata = {
  title: "Contact Us | AlMaghrib Academy",
  description:
    "Contact AlMaghrib Academy for admissions, course information, trial classes, and general inquiries.",
};

export default function Page() {
  return <Contact />;
}