import type { Metadata } from "next";
import FAQ from "./FAQ";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | AlMaghrib Academy",
  description:
    "Find answers to common questions about our online Quran classes, teachers, schedules, and enrollment process.",
};

export default function Page() {
  return <FAQ />;
}