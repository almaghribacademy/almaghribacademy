import type { Metadata } from "next";
import Teacher from "./Teacher";


export const metadata: Metadata = {
  title: "Meet Our Quran Teachers | AlMaghrib Academy",
  description:
    "Meet our experienced male and female Quran teachers dedicated to helping students succeed online.",
};

export default function Page() {
  return <Teacher />;
}