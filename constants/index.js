import {
  ManageAccounts,
  Trophy,
  Campaign,
  ConnectWithoutContact,
  DesignServices,
  Palette,
  Language,
  Mobile2,
  SportsEsports,
  Analytics,
  Hub,
  Link,
  Cloud,
} from "@material-symbols-svg/react/outlined";

export const curDay = new Date().getDay();
export const curYear = new Date().getFullYear();
export const curDate = new Date().getDate();
export const curMonth = new Date().getMonth();
export const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December",
];

export const days = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export const LINKS = {
  instagram: "#",
  discord: "#",
  gmail: "#",
  linkedin: "#",
  x: "#",
};

// Cleaned up Department Details (Readable names instead of gibberish)
export const reviews = [
  {
    id: "c21ca066-ab4d-40a3-943c-f170d6312bdc",
    icon: ManageAccounts,
    tone: "#8ab4f8",
    name: "Management",
    description: "The backbone of the organization, turning vision into reality by planning, executing, and managing operations.",
  },
  {
    id: "4499a966-2740-4c36-88dd-8916a909fc77",
    icon: Campaign,
    tone: "#FF7A6B",
    name: "Publicity",
    description: "Drives online presence with creative campaigns, storytelling, and community growth.",
  },
  {
    id: "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
    icon: ConnectWithoutContact,
    tone: "#FFD45E",
    name: "Outreach",
    description: "Builds partnerships and expands collaborations with sponsors and communities.",
  },
  {
    id: "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
    icon: DesignServices,
    tone: "#FF7A6B",
    name: "UI/UX",
    description: "Designs visually appealing, user-friendly digital interfaces focused on accessibility and aesthetics.",
  },
  {
    id: "d3beefc1-f8b0-4202-b26c-36e9804b6636",
    icon: Palette,
    tone: "#FFD45E",
    name: "Design",
    description: "Creates stunning visuals, event posters, and branding materials.",
  },
  {
    id: "8143de1d-db17-42fa-958d-13b10804f894",
    icon: Language,
    tone: "#8AB4F8",
    name: "Web Dev",
    description: "Builds responsive, high-performance websites using modern web technologies.",
  },
  {
    id: "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
    icon: Mobile2,
    tone: "#6EE7A0",
    name: "App Dev",
    description: "Builds intuitive, impactful mobile applications for users.",
  },
  {
    id: "9055864f-c7dc-44cd-91d5-8759d32a496a",
    icon: SportsEsports,
    tone: "#FF7A6B",
    name: "Game Dev",
    description: "Combines creativity and technical skills to design engaging games.",
  },
  {
    id: "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
    icon: Analytics,
    tone: "#8AB4F8",
    name: "Data Science",
    description: "Applies AI, machine learning, and analytics to transform data into insights.",
  },
  {
    id: "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
    icon: Cloud,
    tone: "#FFD45E",
    name: "Cloud & DevOps",
    description: "Explores cloud computing, containerization, CI/CD pipelines, and infrastructure.",
  },
  {
    id: "6a89c4e2-7b19-4f32-821e-9821a41b5201",
    icon: Hub,
    tone: "#FF7A6B",
    name: "Blockchain",
    description: "Explores decentralized applications, smart contracts, and Web3 development.",
  },
  {
    id: "3e9ac635-01d4-495e-aa87-a7335a2403c2",
    icon: Trophy,
    tone: "#6EE7A0",
    name: "Competitive Programming",
    description: "Promotes problem-solving skills through coding contests and hackathons.",
  },
];

export const QuestionnaireData = reviews.map((dept) => ({
  department: dept.name,
  questions: [
    {
      name: `Why do you want to join the ${dept.name} department?`,
      type: "long-text",
      placeholder: "Write 2-3 sentences explaining your motivation.",
    },
    {
      name: "What relevant experience or projects have you worked on?",
      type: "long-text",
      placeholder: "Mention past projects, hackathons, or learning experiences.",
    },
    {
      name: "How many hours can you dedicate per week?",
      type: "short-text",
      placeholder: "e.g., 5-8 hours",
    },
  ],
}));

export const sampleAdminHeader = [
  { Header: "SrNo", accessor: "srno" },
  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Department", accessor: "department" },
];

export const CSV_Header = [
  { label: "Name", key: "Name" },
  { label: "Email", key: "Email" },
  { label: "Registration Number", key: "RegistrationNumber" },
  { label: "Phone", key: "Phone" },
  { label: "Department", key: "Department" },
  { label: "Preference", key: "Pref" },
  { label: "Shortlisted", key: "shortlisted" },
  { label: "Questions", key: "Questions" },
];

export const mailingTemplate = {
  Interview: "<p>Thank you for applying! We are excited to let you know you have been shortlisted for joining the #dept Department!</p>",
};

export const technicalCards = [
  {
    title: "Blockchain",
    description: "Explores decentralized apps, smart contracts, and Web3 development.",
    color: "#FF7A6B",
    image: "/assets/images/icons/blockchain.svg",
    formLink: "/6a89c4e2-7b19-4f32-821e-9821a41b5201",
  },
  {
    title: "Cloud & DevOps",
    description: "Explores cloud computing, infrastructure, and automation.",
    color: "#FBBC04",
    image: "/assets/images/icons/cloud.svg",
    formLink: "/a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
  },
  {
    title: "Game Dev",
    description: "Combines creativity and technical skills to design engaging games.",
    color: "#4285F4",
    image: "/assets/images/icons/game-dev.svg",
    formLink: "/9055864f-c7dc-44cd-91d5-8759d32a496a",
  },
  {
    title: "App Dev",
    description: "Builds intuitive, impactful mobile applications.",
    color: "#EA4335",
    image: "/assets/images/icons/app-dev.svg",
    formLink: "/339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
  },
  {
    title: "UI/UX",
    description: "Designs visually appealing, user-friendly digital interfaces.",
    color: "#0F9D58",
    image: "/assets/images/icons/ui-ux.svg",
    formLink: "/e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
  },
  {
    title: "Data Science",
    description: "Applies AI, machine learning, and analytics to transform data.",
    color: "#EA4335",
    image: "/assets/images/icons/data-science.svg",
    formLink: "/c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
  },
  {
    title: "Competitive Programming",
    description: "Promotes problem-solving skills through coding contests.",
    color: "#0F9D58",
    image: "/assets/images/icons/cp.svg",
    formLink: "/3e9ac635-01d4-495e-aa87-a7335a2403c2",
  },
  {
    title: "Web Dev",
    description: "Designs and maintains responsive, high-performance websites.",
    color: "#FBBC04",
    image: "/assets/images/icons/web-dev.svg",
    formLink: "/8143de1d-db17-42fa-958d-13b10804f894",
  },
];

export const nonTechnicalCards = [
  {
    title: "Design",
    description: "Creates stunning visuals, event posters, and branding materials.",
    color: "#329A4E",
    image: "/assets/images/icons/design.svg",
    formLink: "/d3beefc1-f8b0-4202-b26c-36e9804b6636",
  },
  {
    title: "Outreach",
    description: "Builds partnerships and expands outreach by connecting with communities.",
    color: "#4285F4",
    image: "/assets/images/icons/outreach.svg",
    formLink: "/3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
  },
  {
    title: "Publicity",
    description: "Drives online presence with creative campaigns and storytelling.",
    color: "#EA4335",
    image: "/assets/images/icons/social-media.svg",
    formLink: "/4499a966-2740-4c36-88dd-8916a909fc77",
  },
  {
    title: "Management",
    description: "The backbone of the organization, planning, executing, and overseeing events.",
    color: "#FBBC04",
    image: "/assets/images/icons/management.svg",
    formLink: "/c21ca066-ab4d-40a3-943c-f170d6312bdc",
  },
];