import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, MapPin, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

// Define Project type for better type-checking
interface Project {
  title: string;
  category: string;
  location: string;
  completionDate: string;
  area: string;
  description: string;
  image: string;
  features: string[];
  specifications: string[];
}

// Define the projects object with keys and their corresponding project details
const projects: { [key: string]: Project } = {
  "01": {
    title: "KKD Nagar Bus Stand",
    category: "Transportation",
    location: "KKD Nagar, Chennai",
    completionDate: "2024",
    area: "25,000 sq.ft",
    description:
      "A state-of-the-art bus terminus designed to enhance public transportation infrastructure. The project features modern amenities, efficient circulation patterns, and sustainable design elements.",
    image: "/proj-1.jpg",
    features: [
      "Modern architectural design with curved roof structure",
      "Covered waiting areas for passenger comfort",
      "Efficient bus bay layout and circulation",
      "Integrated landscaping and street furniture",
      "Sustainable lighting and ventilation systems",
      "Passenger information display systems",
      "Accessible design for all users",
      "Integration with existing urban infrastructure",
    ],
    specifications: [
      "10 bus bays",
      "Passenger waiting area: 5,000 sq.ft",
      "Commercial space: 2,000 sq.ft",
      "Parking capacity: 50 vehicles",
      "Green spaces: 3,000 sq.ft",
    ],
  },
  "02": {
    title: "Mandaveli West Bus Depot",
    category: "Mixed-Use",
    location: "Mandaveli, Chennai",
    completionDate: "2025",
    area: "75,000 sq.ft",
    description:
      "An innovative mixed-use development that combines a modern bus depot with commercial spaces. The project showcases contemporary architecture with sustainable features and seamless integration of different functions.",
    image: "/proj-2.jpg",
    features: [
      "Integrated commercial and transportation hub",
      "Glass facade with energy-efficient design",
      "Multi-level parking facility",
      "Green building certification",
      "Advanced building management system",
      "Retail and office spaces",
      "Public plaza and gathering spaces",
      "24/7 security and surveillance",
    ],
    specifications: [
      "15 bus bays",
      "Commercial space: 40,000 sq.ft",
      "Office space: 20,000 sq.ft",
      "Parking capacity: 200 vehicles",
      "Green spaces: 5,000 sq.ft",
    ],
  },
  "03": {
    title: "Anna Nagar West Bus Depot",
    category: "Transit-Oriented",
    location: "Anna Nagar West, Chennai",
    completionDate: "2025",
    area: "100,000 sq.ft",
    description:
      "A multi-modal transit hub that integrates bus depot facilities with metro connectivity. This transit-oriented development includes commercial spaces, digital displays, and modern architectural elements.",
    image: "/proj-3.jpg",
    features: [
      "Seamless integration with metro station",
      "Mixed-use development with retail spaces",
      "Digital display integration",
      "Modern architectural design",
      "Climate-controlled waiting areas",
      "Smart ticketing systems",
      "Food court and amenities",
      "Sustainable design features",
    ],
    specifications: [
      "20 bus bays",
      "Retail space: 30,000 sq.ft",
      "Metro connection: Direct access",
      "Parking capacity: 300 vehicles",
      "Food court: 5,000 sq.ft",
    ],
  },
};

// ✅ Fix: Await params properly before using it
export async function generateMetadata({ params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 0)); // Ensures async resolution

  const project = projects[params.id];

  if (!project) {
    notFound();
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects[params.id];

  if (!project) {
    return <div className="text-center text-xl font-bold text-red-500">Project not found</div>;
  }

  return (
    <div className="container py-12 md:py-24">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">{project.title}</h1>
            <p className="mt-2 text-xl text-muted-foreground">{project.category}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm">{project.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">Completion: {project.completionDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" />
              <span className="text-sm">Area: {project.area}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm">{project.category}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Project Overview</h2>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground">{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
