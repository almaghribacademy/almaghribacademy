import type { Metadata } from "next";
import TeacherDetails from "./TeacherDetails";
import { teachers } from "../../../src/data/teachers";

interface TeacherDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: TeacherDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  // const teacher = getTeacher(id);
  const teacher = teachers.find((teacher) => teacher.id === Number(id));

  if (!teacher) {
    return {
      title: "Teacher Not Found | AlMaghrib Academy",
      description: "The requested teacher profile could not be found.",
    };
  }

  return {
    title: `${teacher.name} | Quran Teacher | AlMaghrib Academy`,
    description:
      teacher.bio.length > 160
        ? teacher.bio.slice(0, 157) + "..."
        : teacher.bio,

    openGraph: {
      title: `${teacher.name} | Quran Teacher | AlMaghrib Academy`,
      description: teacher.bio,
      url: `https://AlMaghribacademy.co/teachers/${teacher.id}`,
      siteName: "AlMaghrib Academy",
      type: "profile",
      images: [
        {
          url: `/assets/images/${teacher.image}`,
          width: 1200,
          height: 630,
          alt: teacher.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${teacher.name} | Quran Teacher | AlMaghrib Academy`,
      description: teacher.bio,
      images: [`/assets/images/${teacher.image}`],
    },
  };
}

export default function Page() {
  return <TeacherDetails />;
}