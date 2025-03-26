import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

const getBadgeVariant = (type: string) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type
  return (
    {
      Behavioral: "secondary",
      Mixed: "outline",
      Technical: "default",
    }[normalizedType] || "outline"
  )
}

const userInterviews = [
  {
    id: "1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "CSS"],
    createdAt: new Date(2023, 2, 15),
    feedback: { totalScore: 85, finalAssessment: "Strong technical skills, needs improvement in system design." },
  },
  {
    id: "2",
    role: "UX Designer",
    type: "Behavioral",
    techstack: ["Figma", "Adobe XD"],
    createdAt: new Date(2023, 3, 10),
    feedback: { totalScore: 92, finalAssessment: "Excellent communication skills and portfolio presentation." },
  },
]

const upcomingInterviews = [
  {
    id: "3",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["React", "Node.js", "MongoDB"],
    createdAt: new Date(2023, 4, 5),
  },
  {
    id: "4",
    role: "DevOps Engineer",
    type: "Technical",
    techstack: ["Docker", "Kubernetes", "AWS"],
    createdAt: new Date(2023, 4, 12),
  },
]

const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];


export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};


export { formatDate, getBadgeVariant, userInterviews, upcomingInterviews, interviewCovers }